# Dependency Report

## Summary
`npm audit` was executed across the repository.

## Findings
- **Total Vulnerabilities**: 39 (4 low, 25 moderate, 9 high, 1 critical)

### Critical
1. **passport-saml** via `@xmldom/xmldom`
   - **Details**: XML injection via unsafe CDATA serialization allows attacker-controlled markup insertion.

### High
1. **@langchain/core** (LangChain serialization injection vulnerability enables secret extraction)
2. **@langchain/openai**
3. **@langchain/textsplitters**
4. **@xmldom/xmldom**
5. **langchain**
6. **langsmith** (Prototype Pollution in langsmith-sdk via Incomplete `__proto__` Guard in Internal lodash `set()`)
7. **serialize-javascript** (RCE via RegExp.flags and Date.prototype.toISOString())
8. **xml-crypto**
9. **xml-encryption**

## Remediation
Run `npm audit fix` and `npm audit fix --force` where applicable, or manually upgrade the dependencies in `package.json` for `passport-saml`, `@xmldom/xmldom`, `@langchain/core`, and `serialize-javascript`.
