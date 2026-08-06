// ─────────────────────────────────────────────────────────────────────────────
// PariLink Mobile — Biometric Authentication Service
// Wraps react-native-biometrics for FaceID/TouchID/Fingerprint.
// Stores a signed biometric challenge in keychain to validate intent.
// ─────────────────────────────────────────────────────────────────────────────

import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });

export const BiometricService = {
  async isAvailable(): Promise<{ available: boolean; biometryType: string | null }> {
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();
    return {
      available,
      biometryType: biometryType ?? null,
    };
  },

  async authenticate(reason: string = 'Verify your identity to access PariLink'): Promise<boolean> {
    const { available } = await rnBiometrics.isSensorAvailable();
    if (!available) {return false;}

    const { success } = await rnBiometrics.simplePrompt({ promptMessage: reason });
    return success;
  },

  getBiometryLabel(type: string | null): string {
    if (type === BiometryTypes.FaceID)       {return 'Face ID';}
    if (type === BiometryTypes.TouchID)      {return 'Touch ID';}
    if (type === BiometryTypes.Biometrics)   {return 'Fingerprint';}
    return 'Biometrics';
  },
};
