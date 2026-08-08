// Use existing backend roles only as per prompt constraints
export type UserRole = 'SUPER_ADMIN' | 'ORG_ADMIN' | 'OPERATIONS' | 'FINANCE' | 'SALES' | 'DISPATCHER' | 'VIEWER' | 'DRIVER';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'LOCKED' | 'PENDING_INVITE';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  department?: string;
  branch?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminFilters {
  search?: string;
  role?: UserRole[];
  status?: UserStatus[];
  department?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'createdAt' | 'lastLoginAt';
  sortDesc?: boolean;
}

export interface PaginatedUsers {
  data: User[];
  total: number;
  page: number;
  limit: number;
}
