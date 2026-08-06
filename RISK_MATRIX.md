# Risk Matrix

| Finding | Risk Level | Likelihood | Impact | Remediation |
| :--- | :---: | :---: | :---: | :--- |
| **Leaked DB Credentials** (`made by other devlopre...`) | **CRITICAL** | High | High | Rotate `parilink_admin` password immediately. Delete folder. |
| **SSRF** (`webhook-platform.service.ts`) | **CRITICAL** | High | High | Implement URL validation and block internal IPs/localhost. |
| **NPM Critical Vuln** (`passport-saml` / `xmldom`) | **CRITICAL** | Med | High | Update `passport-saml` and `@xmldom/xmldom` packages. |
| **AI Raw SQL Execution** (`tools.ts`) | **HIGH** | High | High | Remove `$queryRawUnsafe`. Use strict ORM methods or heavily sanitized read-only replicas. |
| **SQL Injection** (`data-quality-engine.service.ts`) | **HIGH** | Med | High | Refactor to use Prisma's native JSONB filtering or parameterized `Prisma.sql`. |
| **Command Injection** (`backup-recovery.service.ts`) | **HIGH** | Low | High | Use `spawn` instead of `exec` and validate environment variables. |
| **Hardcoded Webhook Secret** | **HIGH** | High | Med | Move `whsec_replay_secret` to environment variables. |
