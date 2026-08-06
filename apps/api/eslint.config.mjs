// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',  // P2-2: enabled as warning. Fix progressively.
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
      'no-case-declarations': 'off',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[callee.object.property.name="auditLog"][callee.property.name="create"]',
          message: 'Framework bypass detected: Manual audit logging is strictly forbidden. Inject and use AuditService.logEvent(event, context, tx) to guarantee HMAC tamper-evidence.'
        },
        {
          selector: 'Property[key.name="where"] Property[key.name="deletedAt"][value.type="Literal"]',
          message: 'Framework bypass detected: Manual soft-delete filters (deletedAt: null) are strictly forbidden. The platform automatically injects these into all nested queries.'
        },
        {
          selector: 'MemberExpression[object.property.name="prisma"][property.name!="$on"][property.name!="runAsTenant"][property.name!="runAsSystem"][property.name!="$disconnect"][property.name!="$connect"][property.name!="$transaction"][property.name!="updateWithOcc"][property.name!="setupSoftDeleteMiddleware"]',
          message: 'Framework bypass detected: Direct Prisma model access is strictly forbidden. You MUST use this.prisma.runAsTenant(companyId, tx => ...) or this.prisma.runAsSystem(tx => ...) to ensure PostgreSQL RLS and transaction boundaries are respected.'
        }
      ],
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
);
