export type Role = 'SUPER_ADMIN' | 'ORG_ADMIN' | 'DISPATCHER' | 'DRIVER' | 'VIEWER' | 'OPERATIONS' | 'FINANCE' | 'SALES' | 'HR' | 'FLEET_MANAGER';

export interface Permission {
  id: string;
  action: string;
  resource: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  theme?: {
    primaryColor: string;
    mode: 'light' | 'dark' | 'system';
  };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: Role;
  permissions: Permission[];
  defaultTenantId?: string;
  tenants: Tenant[];
  mfaEnabled: boolean;
  onboardingCompleted?: boolean;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  expires_in: number;
}
