# Contributing to PariLink Enterprise

Thank you for your interest in contributing to PariLink! As an enterprise product, we maintain strict guidelines for code quality, security, and integration.

## Getting Started

1. **Fork & Branch**: Fork the repository and create a branch from `main` using the format `feature/your-feature-name` or `fix/ticket-id`.
2. **Setup Environment**: Refer to the [README.md](./README.md) for local docker-compose environment setup.
3. **Database Rules**: Do NOT alter the Prisma Schema without an accompanying migration script. Row Level Security (RLS) must be respected using the `runAsTenant` helper in all backend services.

## Pull Request Process

1. **Strict Types**: Your PR will be rejected if it introduces `any` types or `ts-ignore` flags without explicit architectural exemption.
2. **Testing**: You must include Jest unit/integration tests for your changes. Run `npm run test` before submitting.
3. **Linting**: Ensure 100% compliance with `npm run lint` and Prettier formatting.
4. **Code Review**: At least two Staff Engineers must approve your PR. Security mechanisms (Authentication, Authorization, File Uploads) require an additional sign-off from the Security Team.

## License

By contributing to PariLink, you agree that your contributions will be licensed under its Proprietary Commercial License.
