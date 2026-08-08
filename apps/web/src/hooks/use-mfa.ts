import { useState } from 'react';
import { api } from '@/services/api';

export function useMfa() {
  const [isMfaRequired, setMfaRequired] = useState(false);
  const [mfaToken, setMfaToken] = useState<string | null>(null);

  const verifyMfa = async (code: string) => {
    // Expected to be integrated with real MFA verify endpoint
    const response = await api.post('/auth/mfa/verify', { code, token: mfaToken });
    return response;
  };

  return {
    isMfaRequired,
    setMfaRequired,
    mfaToken,
    setMfaToken,
    verifyMfa
  };
}
