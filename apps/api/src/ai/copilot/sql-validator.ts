/**
 * Structural validator for LLM-generated read-only SQL used by the Copilot
 * text-to-SQL fallback.
 *
 * This is NOT a substitute for RLS. It is a defence-in-depth layer that runs
 * BEFORE the query is executed, on top of `runAsTenant(companyId, ...)`
 * (which keeps Postgres RLS active). If this validator has a gap, RLS is
 * still the backstop — that is the point of switching the caller off
 * `runAsSystem`.
 *
 * Zero external dependencies deliberately: a hand-rolled parser for a
 * narrow, LLM-constrained single-SELECT grammar is more auditable here than
 * pulling in a general SQL parser, and the RLS backstop means this doesn't
 * have to be a perfect SQL parser to be a real second layer of defense.
 */

export interface SqlValidationResult {
  ok: boolean;
  reason?: string;
  tables?: string[];
}

const BANNED_WRITE_VERBS = [
  'UPDATE', 'DELETE', 'INSERT', 'DROP', 'ALTER', 'TRUNCATE', 'GRANT',
  'REVOKE', 'EXEC', 'EXECUTE', 'CALL', 'MERGE', 'CREATE', 'VACUUM',
  'SET', 'SET_CONFIG', 'CURRENT_SETTING', 'PG_SLEEP'
];

const CLAUSE_TERMINATORS = ['GROUP BY', 'ORDER BY', 'LIMIT', 'HAVING', 'OFFSET'];

export function validateGeneratedSql(
  rawQuery: string,
  allowedTables: string[],
): SqlValidationResult {
  const query = (rawQuery || '').trim();

  if (!query) {
    return { ok: false, reason: 'Empty query.' };
  }

  // 1. No statement stacking.
  if (query.includes(';')) {
    return { ok: false, reason: 'Semicolons are not allowed (no statement stacking).' };
  }

  // 2. No comments — a comment can hide a "satisfied" placeholder check
  // outside of any real WHERE clause, or hide a second statement from a
  // naive substring scan.
  if (query.includes('--') || query.includes('/*')) {
    return { ok: false, reason: 'SQL comments are not allowed.' };
  }

  // 3. No UNION (or UNION ALL) — the classic way to smuggle a second,
  // differently-scoped SELECT into a single statement.
  if (/\bUNION\b/i.test(query)) {
    return { ok: false, reason: 'UNION is not allowed.' };
  }

  // 4. Must be a single SELECT statement.
  // 4.5 Top-level OR check has been moved to the WHERE clause analysis to allow
  // legitimate uses of OR inside parentheses (e.g. AND (status='A' OR status='B')).
  if (!/^SELECT\b/i.test(query)) {
    return { ok: false, reason: 'Only SELECT statements are allowed.' };
  }

  // 5. No write verbs anywhere (belt-and-suspenders with #4/UNION checks —
  // catches e.g. a write verb inside a CTE or subquery).
  for (const verb of BANNED_WRITE_VERBS) {
    if (new RegExp(`\\b${verb}\\b`, 'i').test(query)) {
      return { ok: false, reason: `Disallowed keyword: ${verb}.` };
    }
  }

  // 6. Extract every table referenced via FROM/JOIN, with optional alias,
  // and reject if any table is outside the allowlist. This is a structural
  // check on the actual FROM/JOIN targets, not a prompt instruction.
  const fromJoinRe = /\b(?:FROM|JOIN)\s+"?([A-Za-z_][A-Za-z0-9_]*)"?(?:\s+(?:AS\s+)?"?([A-Za-z_][A-Za-z0-9_]*)"?)?/gi;
  const refs: { table: string; alias: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = fromJoinRe.exec(query)) !== null) {
    const table = m[1];
    // Guard against the alias capture accidentally eating a following
    // reserved keyword (ON, WHERE, JOIN, etc.) when there's no real alias.
    const nextWord = (m[2] || '').toUpperCase();
    const reserved = ['ON', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'GROUP', 'ORDER', 'LIMIT', 'HAVING'];
    const alias = reserved.includes(nextWord) ? table : (m[2] || table);
    refs.push({ table, alias });
  }

  if (refs.length === 0) {
    return { ok: false, reason: 'No FROM/JOIN targets could be identified — rejecting rather than guessing.' };
  }

  const allowedSet = new Set(allowedTables);
  for (const { table } of refs) {
    if (!allowedSet.has(table)) {
      return { ok: false, reason: `Table "${table}" is not in the allowed table list (${allowedTables.join(', ')}).` };
    }
  }

  // 7. Locate the WHERE clause. The tenant predicate must be inside it —
  // not merely present somewhere in the query string.
  const whereMatch = /\bWHERE\b/i.exec(query);
  if (!whereMatch) {
    return { ok: false, reason: 'No WHERE clause found — every query must filter by companyId.' };
  }
  let whereClause = query.slice(whereMatch.index + whereMatch[0].length);
  for (const terminator of CLAUSE_TERMINATORS) {
    const re = new RegExp(`\\b${terminator.replace(' ', '\\s+')}\\b`, 'i');
    const tMatch = re.exec(whereClause);
    if (tMatch) {
      whereClause = whereClause.slice(0, tMatch.index);
    }
  }

  // 8. Require the companyId predicate to be the outermost conjunct.
  // The WHERE clause must begin exactly with the required tenant predicates,
  // chained by AND, so that they cannot be bypassed via OR.
  const placeholder = "\\{\\{COMPANY_ID_PLACEHOLDER\\}\\}";
  const uniqueAliases = Array.from(new Set(refs.map((r) => r.alias)));
  const usesAliases = refs.some((r) => r.alias !== r.table);

  let remaining = whereClause.trim();
  const satisfied = new Set<string>();

  while (true) {
    let matchedAny = false;

    // Check bare unaliased predicate
    if (!usesAliases && uniqueAliases.length === 1 && !satisfied.has(uniqueAliases[0])) {
      const bareRegex = new RegExp(`^"?companyId"?\\s*=\\s*'${placeholder}'(?:\\s+AND\\s+|$)`, 'i');
      const m = remaining.match(bareRegex);
      if (m) {
        satisfied.add(uniqueAliases[0]);
        remaining = remaining.slice(m[0].length).trim();
        matchedAny = true;
      }
    }

    // Check alias-qualified predicate
    for (const alias of uniqueAliases) {
      if (satisfied.has(alias)) continue;
      const qualifiedRegex = new RegExp(`^"?${alias}"?\\."?companyId"?\\s*=\\s*'${placeholder}'(?:\\s+AND\\s+|$)`, 'i');
      const m = remaining.match(qualifiedRegex);
      if (m) {
        satisfied.add(alias);
        remaining = remaining.slice(m[0].length).trim();
        matchedAny = true;
      }
    }

    if (!matchedAny) break;
  }

  if (satisfied.size !== uniqueAliases.length) {
    return { 
      ok: false, 
      reason: 'WHERE clause must begin exactly with all required companyId predicates chained by AND.' 
    };
  }

  if (remaining.toLowerCase().includes('companyid')) {
    return { 
      ok: false, 
      reason: 'companyId predicate must only appear at the very beginning of the WHERE clause.' 
    };
  }

  return { ok: true, tables: refs.map((r) => r.table) };
}
