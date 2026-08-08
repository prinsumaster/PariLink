export type DriverStatus = 'ONLINE' | 'OFFLINE' | 'DRIVING' | 'RESTING' | 'ON_LEAVE' | 'AVAILABLE' | 'ASSIGNED' | 'IN_TRIP';

export interface DriverDocument {
  id: string;
  type: 'DRIVING_LICENSE' | 'MEDICAL_CERTIFICATE' | 'IDENTITY_PROOF' | 'TRAINING_CERT' | 'BACKGROUND_CHECK' | 'EMPLOYMENT_CONTRACT';
  documentNumber: string;
  issuedDate: string;
  expiryDate: string;
  fileUrl?: string;
  isExpiringSoon: boolean;
  isExpired: boolean;
}

export interface SafetyAnalytics {
  driverScore: number; // 0-100
  speedingEvents: number;
  harshBraking: number;
  harshCornering: number;
  fatigueAlerts: number;
  idleTimeMinutes: number;
  fuelEfficiency: number;
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface Driver {
  id: string;
  employeeCode: string;
  name: string;
  photoUrl?: string;
  phone: string;
  email?: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: string;
  nationalIdMasked: string; // e.g. XXXX-XXXX-1234
  bloodGroup: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  branchId?: string;
  status: DriverStatus;
  currentVehicleId?: string;
  currentTripId?: string;
  documents: DriverDocument[];
  safetyAnalytics?: SafetyAnalytics;
  createdAt: string;
  updatedAt: string;
}

export interface DriverFilters {
  status?: DriverStatus[];
  branchId?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDesc?: boolean;
}

export interface PaginatedDrivers {
  data: Driver[];
  total: number;
  page: number;
  limit: number;
}
