export interface OrganizationSettings {
  name: string;
  taxId: string;
  supportEmail: string;
  supportPhone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  localization: {
    timezone: string;
    currency: string;
    dateFormat: string;
    weightUnit: 'kg' | 'lbs';
    distanceUnit: 'km' | 'mi';
  };
}

export interface SecuritySettings {
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSymbols: boolean;
    expiryDays: number;
  };
  mfa: {
    required: boolean;
    allowedMethods: ('APP' | 'SMS' | 'EMAIL')[];
  };
  sso: {
    enabled: boolean;
    provider: 'SAML' | 'OIDC' | 'NONE';
    domainRestrictions: string[];
  };
  sessionTimeoutMinutes: number;
}
