# PARILINK AUDIT RULES — BINDING, DO NOT DELETE

**This file is the constitution for every security audit loop. It is committed to the repo so a
tool restart cannot erase it. If you are an agent resuming work and you do not remember the
current loop's state, read this file, then read `docs/security/AUDIT_STATE.md`, then stop and
report your understanding before acting.**

---

## THE TEN RULES

1. **Auditor ≠ implementer.** During an audit loop you write no fixes to `apps/`. Finding and
   fixing are separate loops with a human gate between them.

2. **No writes under `apps/`.** Attack scripts, seeds, and evidence live under `evidence/` and
   docs under `docs/`. If `git status --porcelain` shows anything modified under `apps/` during an
   audit, that is a violation to revert (`git checkout -- apps/`) and log, not to keep.

3. **No runtime data mutation of existing rows.** You may create A/B tenant fixtures. You may
   **never** update existing users, passwords, invoices, payments, or config at runtime to make an
   attack work. Passwords are bcrypt-hashed **in the seed**. If an attack needs mutated state, the
   seed creates it up front.

4. **Never set `app.bypass_rls` (or any RLS/guard bypass) on the attack database.** The attack DB
   must behave exactly like production. Bypass flags are themselves audit targets, not tools.

5. **Four artifacts per vector, always.** Every attack produces, under
   `evidence/<loop>/<vector>/`: `attack.<ts|js>`, `output.log`, `db-verify.sql` + `db-verify.out`,
   `NOTES.md`. A SECURE/PASS verdict with no `attack` file is rejected on sight.

6. **An HTTP status is never proof. Row state is proof.** Every verdict cites a database
   before/after, not a 200 or a 404 alone.

7. **"Verified by inspection" is banned.** If you cannot write the attack, the item is
   `UNVERIFIED`. Reading the code and concluding it looks safe is not a verification.

8. **Every finding carries a Confidence field:** `PROVEN` (attack ran, output shown) / `LIKELY`
   (static reasoning only) / `THEORETICAL`. Do not print PROVEN without a shown `output.log`.

9. **Never change an attack because the result is inconvenient.** If an attack won't run or
   produces an ambiguous result, report that — it is often the finding. Swapping in an easier
   attack and passing the vector is falsification.

10. **"Complete" means every planned vector has its four artifacts.** Not "the ones I reached."
    Do not report completion, chain past a gate, or offer remediation until the state file says
    every vector is closed with evidence.

## GATE PROTOCOL

- Loops run in phases separated by **human gates**. At a gate you STOP and report. You do not
  proceed on your own authority.
- After any restart, you re-read this file and `AUDIT_STATE.md` and STOP for confirmation before
  touching anything. A restart never means "resume and declare done."

## ACCEPTED-FINDING PROVENANCE

A finding is only "accepted" when `AUDIT_STATE.md` lists it as accepted by the human reviewer.
An agent's own prior report saying SECURE or VULNERABLE is a hypothesis, not an accepted result —
including reports written before a restart.
