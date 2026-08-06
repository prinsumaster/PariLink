// PariLink Mobile — ESLint Configuration
// Uses @react-native/eslint-config (ESLint v8 legacy format).
// P2-1 FIX: Created this file to resolve "ESLint couldn't find an eslint.config file"
// error caused by ESLint v9's new Flat Config default.
// We use ESLINT_USE_FLAT_CONFIG=false in the lint script to activate this file.

module.exports = {
  root: true,
  extends: '@react-native',
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    // P2-2: surface any usages as warnings for progressive remediation
    '@typescript-eslint/no-explicit-any': 'warn',

    // @typescript-eslint/func-call-spacing was removed in @typescript-eslint v6+
    // but @react-native/eslint-config still references it — disable to prevent
    // "Definition for rule not found" errors on every file.
    '@typescript-eslint/func-call-spacing': 'off',

    // Configure unused-vars to honour the _ prefix convention for intentionally
    // unused parameters (standard TypeScript community pattern).
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],

    // react-hooks/exhaustive-deps: warn only — these are correctness hints,
    // not security issues. Failing CI on missing deps blocks all feature work.
    // Engineers should address these incrementally.
    'react-hooks/exhaustive-deps': 'warn',

    // Style/noise rules — warn only
    'react-native/no-unused-styles': 'warn',
    'react-native/no-inline-styles': 'warn',
    'no-bitwise': 'warn',
    'curly': 'warn',
    'dot-notation': 'warn',
    'no-useless-escape': 'warn',

    // Allow console in React Native (debug logs gated by __DEV__)
    'no-console': 'off',
  },
  env: {
    jest: true,
  },
  ignorePatterns: [
    'node_modules/',
    'android/',
    'ios/',
    'dist/',
  ],
};
