export function redactPii(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }

  const sensitiveKeys = [
    'password',
    'passwordHash',
    'token',
    'accessToken',
    'refreshToken',
    'secret',
    'apiKey',
    'totpSecret',
    'clientSecret',
    'creditCard',
    'ssn',
    'taxId',
    'authorization',
  ];

  if (Array.isArray(data)) {
    return data.map((item) => redactPii(item));
  } else if (typeof data === 'object') {
    const redactedData: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (
        sensitiveKeys.some((sensitiveKey) =>
          key.toLowerCase().includes(sensitiveKey.toLowerCase()),
        )
      ) {
        redactedData[key] = '[REDACTED]';
      } else {
        redactedData[key] = redactPii(value);
      }
    }
    return redactedData;
  }

  return data;
}
