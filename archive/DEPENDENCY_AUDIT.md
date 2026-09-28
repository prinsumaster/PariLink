# Dependency Audit Report (Phase 3)

## Security Vulnerabilities
Based on the empirical `npm audit` execution across the monorepo:

| Package | Severity | Description | Fix Recommendation |
| :--- | :--- | :--- | :--- |
| `@langchain/anthropic` | **HIGH** | @langchain/anthropic | `npm audit fix` or force upgrade to @langchain/anthropic |
| `@langchain/community` | **HIGH** | @langchain/community | `npm audit fix` or force upgrade to langchain |
| `@langchain/core` | **HIGH** | @langchain/core | `npm audit fix` or force upgrade to @langchain/core |
| `@langchain/google-genai` | **HIGH** | @langchain/google-genai | `npm audit fix` or force upgrade to @langchain/google-genai |
| `@langchain/openai` | **HIGH** | @langchain/openai | `npm audit fix` or force upgrade to @langchain/openai |
| `@langchain/textsplitters` | **HIGH** | @langchain/textsplitters | `npm audit fix` or force upgrade to langchain |
| `@xmldom/xmldom` | **HIGH** | @xmldom/xmldom | `npm audit fix` or force upgrade to latest |
| `expr-eval` | **HIGH** | expr-eval | `npm audit fix` or force upgrade to langchain |
| `langchain` | **HIGH** | langchain | `npm audit fix` or force upgrade to langchain |
| `langsmith` | **HIGH** | langsmith | `npm audit fix` or force upgrade to langchain |
| `passport-saml` | **CRITICAL** | passport-saml | `npm audit fix` or force upgrade to latest |
| `serialize-javascript` | **HIGH** | serialize-javascript | `npm audit fix` or force upgrade to latest |
| `xml-crypto` | **HIGH** | xml-crypto | `npm audit fix` or force upgrade to undefined |
| `xml-encryption` | **HIGH** | xml-encryption | `npm audit fix` or force upgrade to undefined |

## Outdated Packages (Technical Debt)
Packages that are significantly behind their `latest` versions.

| Package | Current | Latest | Type |
| :--- | :--- | :--- | :--- |
| `@babel/core` | 7.29.7 | 8.0.1 | undefined |
| `@babel/preset-env` | 7.29.7 | 8.0.2 | undefined |
| `@babel/runtime` | 7.29.7 | 8.0.0 | undefined |
| `@base-ui/react` | 1.6.0 | 1.7.0 | undefined |
| `@cmfcmf/docusaurus-search-local` | 1.2.0 | 2.0.1 | undefined |
| `@eslint/js` | 9.39.5 | 10.0.1 | undefined |
| `@langchain/anthropic` | 0.1.21 | 1.5.4 | undefined |
| `@langchain/core` | 0.1.63 | 1.2.5 | undefined |
| `@langchain/google-genai` | 0.0.1 | 2.2.0 | undefined |
| `@langchain/openai` | 0.0.30 | 1.5.6 | undefined |
| `@prisma/client` | 5.22.0 | 7.9.1 | undefined |
| `@react-native-async-storage/async-storage` | 2.2.0 | 3.1.1 | undefined |
| `@react-native-community/netinfo` | 11.5.2 | 12.0.1 | undefined |
| `@react-native-firebase/app` | 21.14.0 | 26.1.0 | undefined |
| `@react-native-firebase/messaging` | 21.14.0 | 26.1.0 | undefined |
| `@react-native-voice/voice` | 3.1.5 | 3.2.4 | undefined |
| `@react-native/babel-preset` | 0.75.5 | 0.86.2 | undefined |
| `@react-native/eslint-config` | 0.75.5 | 0.86.2 | undefined |
| `@react-native/metro-config` | 0.75.5 | 0.86.2 | undefined |
| `@react-native/typescript-config` | 0.75.5 | 0.86.2 | undefined |
| `@react-navigation/bottom-tabs` | 6.6.1 | 7.18.15 | undefined |
| `@react-navigation/drawer` | 6.7.2 | 7.13.7 | undefined |
| `@react-navigation/native` | 6.1.18 | 7.3.15 | undefined |
| `@react-navigation/native-stack` | 6.11.0 | 7.18.7 | undefined |
| `@tanstack/react-query` | 5.101.2 | 5.101.4 | undefined |
| `@tanstack/react-table` | 8.21.3 | 9.0.0 | undefined |
| `@types/jest` | 29.5.14 | 30.0.0 | undefined |
| `@types/react-dom` | 19.2.3 | 19.2.4 | undefined |
| `@types/semver` | 7.7.1 | 7.8.0 | undefined |
| `bullmq` | 5.81.1 | 6.0.8 | undefined |
| `date-fns` | 3.6.0 | 4.4.0 | undefined |
| `eslint-config-next` | 16.2.10 | 16.3.0 | undefined |
| `framer-motion` | 12.42.2 | 13.0.0 | undefined |
| `globals` | 17.7.0 | 17.9.0 | undefined |
| `i18next` | 23.16.8 | 26.3.6 | undefined |
| `ioredis` | 5.11.1 | 6.0.0 | undefined |
| `jest` | 29.7.0 | 30.4.2 | undefined |
| `lottie-react-native` | 7.3.8 | 7.4.0 | undefined |
| `lucide-react` | 1.25.0 | 1.28.0 | undefined |
| `maplibre-gl` | 6.0.0 | 6.2.0 | undefined |
| `metro` | 0.80.12 | 0.87.0 | undefined |
| `openid-client` | 5.7.1 | 6.8.4 | undefined |
| `otplib` | 11.0.1 | 13.4.1 | undefined |
| `prettier` | 3.9.5 | 3.9.6 | undefined |
| `prisma` | 5.22.0 | 7.9.1 | undefined |
| `react-i18next` | 15.7.4 | 17.0.11 | undefined |
| `react-map-gl` | 8.1.1 | 8.1.2 | undefined |
| `react-native-background-geolocation` | 4.19.4 | 5.4.0 | undefined |
| `react-native-chart-kit` | 6.12.3 | 7.0.2 | undefined |
| `react-native-gesture-handler` | 2.32.0 | 3.1.0 | undefined |
| `react-native-haptic-feedback` | 2.3.4 | 3.0.0 | undefined |
| `react-native-image-picker` | 7.2.3 | 8.2.1 | undefined |
| `react-native-keychain` | 9.2.3 | 10.0.0 | undefined |
| `react-native-pdf` | 6.7.7 | 7.0.4 | undefined |
| `react-native-permissions` | 4.1.5 | 5.6.1 | undefined |
| `react-native-reanimated` | 3.19.5 | 4.5.3 | undefined |
| `react-native-safe-area-context` | 4.14.1 | 5.8.1 | undefined |
| `react-native-screens` | 3.37.0 | 4.26.2 | undefined |
| `react-native-signature-canvas` | 4.7.4 | 5.1.1 | undefined |
| `recharts` | 3.9.2 | 3.10.1 | undefined |
| `shadcn` | 4.14.0 | 4.16.1 | undefined |
| `tailwindcss` | 4.3.2 | 4.3.3 | undefined |
| `ts-jest` | 29.4.11 | 29.4.12 | undefined |
| `typescript-eslint` | 8.64.0 | 8.66.0 | undefined |
| `uuid` | 10.0.0 | 14.0.1 | undefined |
| `yjs` | 13.6.31 | 13.6.32 | undefined |
