# PariLink Driver & Fleet Mobile App

A production-grade React Native (v0.75) cross-platform mobile application for PariLink Enterprise. Supports iOS, Android, and Tablets.

## Framework Choice — React Native (TypeScript)

**React Native was selected over Flutter** because:
1. The entire PariLink stack is TypeScript/JavaScript — React Native allows code reuse across the web portal and mobile app (types, API clients, business logic, validation schemas).
2. Existing engineering team has zero Dart/Flutter experience — zero ramp-up cost.
3. Mature ecosystem for enterprise mobile (react-native-keychain, react-native-maps, react-native-mlkit, FCM).

## Architecture

```
apps/mobile/
├── App.tsx                          ← Root entry (Redux Provider + Navigation)
├── src/
│   ├── theme/index.ts               ← Design system (Light/Dark themes, typography, spacing)
│   ├── types/index.ts               ← Global TypeScript types
│   ├── navigation/AppNavigator.tsx  ← Auth-gated stack + bottom tab navigator
│   │
│   ├── store/                       ← RTK Redux store (persisted)
│   │   ├── index.ts                 ← Store setup + persistor
│   │   └── slices/
│   │       ├── authSlice.ts         ← Login, biometric, refresh, logout
│   │       ├── tripsSlice.ts        ← Active trip, load status, GPS tracking
│   │       ├── uiSlice.ts           ← Theme, loading, toasts
│   │       ├── offlineSlice.ts      ← Network state, queue count
│   │       └── notificationsSlice.ts← Push notifications
│   │
│   ├── services/
│   │   ├── api/client.ts            ← Axios client (JWT, auto-refresh, retry)
│   │   ├── SecureStorage.ts         ← Keychain-backed token storage (AES-256)
│   │   ├── biometric/BiometricService.ts ← FaceID/TouchID/Fingerprint
│   │   ├── location/LocationService.ts   ← Battery-efficient GPS tracking
│   │   └── ocr/OcrService.ts        ← On-device MLKit text recognition
│   │
│   ├── offline/
│   │   └── OfflineQueue.ts          ← SQLite-backed persistent action queue
│   │
│   ├── screens/
│   │   ├── auth/LoginScreen.tsx     ← Login + Biometric + OTP
│   │   ├── dashboard/DashboardScreen.tsx ← Driver home with active trip
│   │   ├── trips/TripDetailScreen.tsx    ← Map + load list + status CTAs
│   │   ├── documents/DocumentCameraScreen.tsx ← Camera + OCR + upload
│   │   ├── expenses/ExpenseFormScreen.tsx     ← Expense logging
│   │   └── emergency/EmergencySOSScreen.tsx   ← SOS with press-and-hold
│   │
│   ├── components/
│   │   ├── trips/TripStatusChip.tsx
│   │   └── common/OfflineBanner.tsx
│   │
│   └── utils/helpers.ts             ← UUID, formatting, distance calculation
│
└── __tests__/mobile.test.ts         ← Jest unit tests
```

## API Integration

All backend communication is through the existing PariLink APIs:

| Feature | API Endpoint |
|---------|-------------|
| Login | `POST /api/v1/auth/login` |
| Token Refresh | `POST /api/v1/auth/refresh` |
| Active Trip | `GET /api/v1/mobile/trips/active` |
| Update Trip Status | `PATCH /api/v1/mobile/trips/:id/status` |
| Update Load Status | `PATCH /api/v1/mobile/loads/:id/status` |
| Location Ping | `POST /api/v1/mobile/location` |
| Sync Offline Queue | `POST /api/v1/mobile/sync` |
| Upload Document | `POST /api/v1/mobile/upload/:type` |
| Submit Expense | `POST /api/v1/expenses` |
| List Notifications | `GET /api/v1/notifications` |
| Emergency SOS | `POST /api/v1/mobile/sos` |

## Security Implementation

| Control | Implementation |
|---------|---------------|
| Token Storage | `react-native-keychain` (hardware-backed secure enclave) |
| Biometric Auth | FaceID / TouchID / Fingerprint via `react-native-biometrics` |
| Token Refresh | Silent Axios interceptor — no user interruption |
| Offline Data | SQLite + AES-256 (via Keychain sealed storage) |
| Certificate Pinning | `react-native-ssl-pinning` (configure in `client.ts`) |

## Offline Capabilities

- **SQLite persistent queue** — All state-mutating actions captured offline
- **Conflict resolution** — Sequential replay via `/mobile/sync` endpoint
- **Dead-letter queue** — Items exceeding 5 retries are purged to prevent infinite loops
- **Network listener** — Automatic queue flush on reconnect
- **Optimistic UI** — Status updates applied instantly; rolled back on failure

## Local Development

### Prerequisites
- Node.js 20+
- Xcode 16+ (iOS)
- Android Studio Ladybug+ (Android)
- Ruby 3.2+ (for CocoaPods)

### iOS
```bash
cd apps/mobile
npm install
cd ios && bundle exec pod install && cd ..
npx react-native run-ios
```

### Android
```bash
cd apps/mobile
npm install
npx react-native run-android
```

### Configure API Base URL
In `src/services/api/client.ts`:
```ts
const BASE_URL = __DEV__
  ? 'http://localhost:8080/api/v1'  // Local API
  : 'https://api.parilink.app/api/v1';  // Production
```

## Building for Production

```bash
# Android AAB (Google Play)
cd android
./gradlew bundleRelease

# iOS Archive (App Store)
npx react-native build-ios --configuration Release
```
