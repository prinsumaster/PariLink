/**
 * Mobile Authentication & Secure Storage Helpers
 */

export class SecureStorage {
  // Simple wrapper using Web Crypto API to encrypt sensitive data for local storage
  // In a production enterprise app, we'd use a more robust KMS/encryption strategy.
  
  static async setItem(key: string, value: string) {
    if (typeof window === 'undefined') return;
    try {
      // Dummy encryption for demonstration
      const encoded = btoa(encodeURIComponent(value));
      localStorage.setItem(`secure_${key}`, encoded);
    } catch (e) {
      console.error('Failed to securely store item', e);
    }
  }

  static async getItem(key: string): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    try {
      const encoded = localStorage.getItem(`secure_${key}`);
      if (!encoded) return null;
      return decodeURIComponent(atob(encoded));
    } catch (e) {
      console.error('Failed to retrieve secure item', e);
      return null;
    }
  }

  static async removeItem(key: string) {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`secure_${key}`);
  }
}

export class WebAuthnHelper {
  static async isAvailable(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    return !!window.PublicKeyCredential && 
           PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable && 
           await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  }

  static async authenticate(): Promise<boolean> {
    if (!(await this.isAvailable())) {
      console.warn('WebAuthn is not available on this device.');
      return false;
    }
    
    try {
      // Mock standard WebAuthn get request
      // In a real app, this requires server challenge & validation
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge,
          rpId: window.location.hostname,
          userVerification: "required",
        }
      });
      
      return !!credential;
    } catch (e) {
      console.error('WebAuthn authentication failed', e);
      return false;
    }
  }
}
