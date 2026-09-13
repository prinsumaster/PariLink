/**
 * Security regression test: no component may read a Bearer token or role
 * directly from localStorage. All auth reads must go through:
 *  - api.ts (axios singleton reading useAuthStore.getState().token)
 *  - useAuthStore hook (Zustand with cookie-coupled customStorage)
 *
 * If this test fails, a component has re-introduced a raw localStorage auth bypass.
 */

import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

const WEB_SRC = path.resolve('/Users/vishalvirda/Desktop/PariLink/apps/web/src');

describe('Security: no raw localStorage auth reads in components', () => {

  // Patterns that are BANNED in component code (.tsx / .ts)
  const BANNED_PATTERNS = [
    // Literal string access for tokens and roles
    /(?:localStorage|sessionStorage)\.getItem\(['"`](?:token|access_token|auth_token|jwt|role)['"`]\)/,
    // Dynamic access (non-literal first argument) which could be hiding a token key
    /(?:localStorage|sessionStorage)\.getItem\((?!['"`])/
  ];

  // Files that are ALLOWED to touch localStorage (Zustand store internals, mobile-auth util, etc.)
  const ALLOWLIST = [
    'store/auth.ts',           // Zustand customStorage — intentional, cookie-coupled
    'lib/security/mobile-auth.ts', // Explicit secure wrapper — not raw auth
    'lib/command-registry.ts', // Stores recent UI commands (non-auth dynamic key)
  ];

  function collectFiles(dir: string, exts: string[]): string[] {
    const result: string[] = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        result.push(...collectFiles(full, exts));
      } else if (exts.some(e => entry.name.endsWith(e))) {
        result.push(full);
      }
    }
    return result;
  }

  const allFiles = collectFiles(WEB_SRC, ['.ts', '.tsx']);

  for (const file of allFiles) {
    const rel = path.relative(WEB_SRC, file);
    const isAllowlisted = ALLOWLIST.some(a => rel.replace(/\\/g, '/').includes(a));
    if (isAllowlisted) continue;

    it(`${rel} — no banned localStorage auth pattern`, () => {
      const src = fs.readFileSync(file, 'utf8');

      // Skip comment lines (lines starting with // or * after trimming)
      const codeLines = src.split('\n').filter(line => {
        const t = line.trimStart();
        return !t.startsWith('//') && !t.startsWith('*') && !t.startsWith('/*');
      }).join('\n');

      for (const pattern of BANNED_PATTERNS) {
        const match = codeLines.match(pattern);
        expect(match).toBeNull();
        if (match) {
          fail(
            `SECURITY VIOLATION in ${rel}:\n` +
            `  Found banned localStorage auth read: "${match[0]}"\n` +
            `  Use useAuthStore() or the api singleton (api.ts) instead.`
          );
        }
      }
    });
  }
});
