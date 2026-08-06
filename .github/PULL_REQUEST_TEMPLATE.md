## Description
<!-- Describe your changes in detail -->
<!-- What does this PR do? Why is it needed? -->

## Ticket / Jira Issue
<!-- Link to the Jira ticket or GitHub issue -->
Fixes #

## Impact Area
<!-- What parts of the application are affected? -->
- [ ] Authentication / Tenant Isolation
- [ ] Infrastructure / CI/CD
- [ ] Control Tower (Dashboard)
- [ ] Fleet Management
- [ ] Finance & Billing
- [ ] Other: _____

## Checklist
- [ ] I have read the `CONTRIBUTING.md` guidelines.
- [ ] My code strictly adheres to the enterprise linting & typechecking rules (`npm run lint`, `tsc`).
- [ ] I have verified tenant isolation applies correctly if my changes touch data access.
- [ ] I have successfully run the E2E test suite locally (`npx playwright test`).
- [ ] I have added appropriate automated tests (Unit / Integration / E2E).
- [ ] This change does not introduce severe bundle size bloat (verified dynamic imports).
- [ ] I have documented any required infrastructure or schema changes.

## Security & Compliance
- [ ] My changes do not expose `process.env` secrets to the client unless explicitly intended.
- [ ] My changes enforce strict RBAC / Role-based authorization.
- [ ] I am not suppressing warnings/errors just to pass CI gates.

## Screenshots (if applicable)
<!-- Add before/after screenshots for UI changes -->
