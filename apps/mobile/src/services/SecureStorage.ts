// ─────────────────────────────────────────────────────────────────────────────
// PariLink Mobile — Secure Storage
// Wraps react-native-keychain to store/retrieve sensitive tokens
// behind hardware-backed secure enclave on both iOS and Android.
// All token data is encrypted at rest using AES-256.
// ─────────────────────────────────────────────────────────────────────────────

import * as Keychain from 'react-native-keychain';

const ACCESS_TOKEN_KEY  = 'parilink.access_token';
const REFRESH_TOKEN_KEY = 'parilink.refresh_token';
const USER_KEY          = 'parilink.user';

export const SecureStorage = {
  // ── Tokens ──────────────────────────────────────────────────────────────────
  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await Keychain.setGenericPassword(ACCESS_TOKEN_KEY, accessToken, {
      service:           ACCESS_TOKEN_KEY,
      accessControl:     Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
      accessible:        Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
    await Keychain.setGenericPassword(REFRESH_TOKEN_KEY, refreshToken, {
      service:    REFRESH_TOKEN_KEY,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  },

  async getAccessToken(): Promise<string | null> {
    const result = await Keychain.getGenericPassword({ service: ACCESS_TOKEN_KEY });
    return result ? result.password : null;
  },

  async getRefreshToken(): Promise<string | null> {
    const result = await Keychain.getGenericPassword({ service: REFRESH_TOKEN_KEY });
    return result ? result.password : null;
  },

  async clearTokens(): Promise<void> {
    await Keychain.resetGenericPassword({ service: ACCESS_TOKEN_KEY });
    await Keychain.resetGenericPassword({ service: REFRESH_TOKEN_KEY });
  },

  // ── User Profile (encrypted offline cache) ──────────────────────────────────
  async setUser(user: object): Promise<void> {
    await Keychain.setGenericPassword(USER_KEY, JSON.stringify(user), {
      service:    USER_KEY,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  },

  async getUser<T>(): Promise<T | null> {
    const result = await Keychain.getGenericPassword({ service: USER_KEY });
    if (!result) {return null;}
    try {
      return JSON.parse(result.password) as T;
    } catch {
      return null;
    }
  },

  async clearUser(): Promise<void> {
    await Keychain.resetGenericPassword({ service: USER_KEY });
  },

  async clearAll(): Promise<void> {
    await this.clearTokens();
    await this.clearUser();
  },
};
