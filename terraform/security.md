# PariLink Infrastructure — Security Architecture

## Encryption

| Layer | Mechanism | Key Management |
| :--- | :--- | :--- |
| RDS at rest | AES-256 via AWS KMS | CMK `alias/parilink-rds-{env}` — auto-rotated |
| RDS in transit | SSL forced via parameter group `rds.force_ssl=1` | AWS-managed TLS |
| Redis at rest | AES-256 via AWS KMS | CMK `alias/parilink-redis-{env}` |
| Redis in transit | TLS 1.2+ | AWS-managed TLS |
| S3 at rest | SSE-KMS | CMK `alias/parilink-s3-{env}` |
| S3 in transit | Enforce HTTPS via bucket policy | AWS ACM |
| Secrets Manager | AES-256 via AWS KMS | CMK `alias/parilink-secrets-{env}` |
| CloudWatch Logs | AES-256 via AWS KMS | CMK `alias/parilink-cloudwatch-{env}` |
| EKS Kubernetes Secrets | Envelope encryption | CMK `alias/parilink-eks-{env}` |

## Network Security

- **Bastion-free architecture.** Node access exclusively via AWS SSM Session Manager.
- **No resources have public IPs.** Only the Application Load Balancer is internet-facing.
- **Security Groups follow least privilege.** Database SGs only allow traffic from EKS node SG.
- **Network ACLs** provide a second layer of network filtering in addition to Security Groups.
- **VPC Flow Logs** capture ALL traffic (ACCEPT and REJECT) for security forensics (90-day retention, KMS encrypted).

## Identity & Access

- **IRSA (IAM Roles for Service Accounts):** Kubernetes pods assume IAM roles via OIDC. No long-lived credentials are mounted into pods.
- **GitHub Actions OIDC:** CI/CD pipeline assumes an IAM role via GitHub's OIDC provider. No static AWS_ACCESS_KEY_ID stored in GitHub Secrets.
- **Least Privilege:** The API IRSA role only has access to `parilink/{env}/*` Secrets Manager paths. It cannot read other accounts' secrets.
- **KMS Key Policies:** CloudWatch KMS key restricts access to `logs.{region}.amazonaws.com`. The API cannot decrypt CloudWatch data.

## WAF Rules (Ordered by Priority)

| Priority | Rule | Action |
| :--- | :--- | :--- |
| 10 | AWS Managed OWASP Core Rule Set | Block |
| 20 | AWS Known Bad Inputs | Block |
| 30 | AWS SQLi Rule Set | Block |
| 40 | Rate Limit per IP (1000 req/5min) | Block |
| 50 | Geo Restriction | Count (configurable) |

## Compliance Mapping

| Control | Implementation |
| :--- | :--- |
| Encryption at rest | KMS CMK on all data stores |
| Encryption in transit | TLS enforced at every boundary |
| Access logging | VPC Flow Logs + ALB Access Logs → S3 |
| Audit logging | CloudTrail (ensure enabled at AWS Account level) |
| Data retention | RDS: 35-day PITR. S3 backups: 7-year Glacier. Logs: 90 days. |
| Credential rotation | Secrets Manager auto-rotates DB password every 30 days |
| Vulnerability scanning | OWASP WAF + AWS Inspector (enable at account level) |

## Security Checklist (Before Production Launch)

- [ ] Enable AWS CloudTrail in all regions
- [ ] Enable AWS GuardDuty
- [ ] Enable AWS Security Hub
- [ ] Enable AWS Config with CIS Benchmark rules
- [ ] Run AWS Trusted Advisor — Security checks
- [ ] Complete external Penetration Test
- [ ] Validate SOC2 Type II readiness
- [ ] Rotate all Secrets Manager secrets from initial values
- [ ] Review and restrict WAF Geo Restriction list
- [ ] Enable AWS Shield Standard (included free)
- [ ] Configure MFA on all IAM users and root account
- [ ] Set up AWS SSO with Okta/AzureAD integration
