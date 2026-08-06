// ─────────────────────────────────────────────────────────────────────────────
// PariLink Mobile — Global Type Definitions
// Centralised types for API payloads, store state, and navigation params.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Auth ────────────────────────────────────────────────────────────────────
export interface AuthUser {
  userId:    string;
  companyId: string;
  email:     string;
  name:      string;
  role:      string;
  driverId?: string;
  avatar?:   string;
}

export interface AuthState {
  accessToken:  string | null;
  user:         AuthUser | null;
  isLoading:    boolean;
  isOffline:    boolean;
  biometricAvailable: boolean;
}

export interface LoginPayload {
  email:    string;
  password: string;
}

export interface OtpPayload {
  phone: string;
  otp:   string;
}

// ─── Trip ────────────────────────────────────────────────────────────────────
export type TripStatus = 'PLANNED' | 'DISPATCHED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Load {
  id:       string;
  loadNo:   string;
  status:   string;
  customer: { name: string };
  origin:   string;
  destination: string;
  weight?:  number;
  volume?:  number;
}

export interface Trip {
  id:          string;
  tripNo:      string;
  status:      TripStatus;
  startedAt?:  string;
  completedAt?: string;
  vehicle:     { id: string; regNo: string; vehicleType: string };
  loads:       Load[];
  plannedRoute?: { origin: string; destination: string; distanceKm: number };
}

// ─── Location ────────────────────────────────────────────────────────────────
export interface LocationPing {
  tripId:    string;
  latitude:  number;
  longitude: number;
  speed?:    number;
  heading?:  number;
  accuracy?: number;
  timestamp: string;
}

// ─── Document Upload ─────────────────────────────────────────────────────────
export type DocumentType = 'POD' | 'SIGNATURE' | 'FUEL' | 'EXPENSE' | 'TOLL' | 'INVOICE';

export interface DocumentUpload {
  type:        DocumentType;
  referenceId: string;
  fileUri:     string;
  mimeType:    string;
  fileName:    string;
}

// ─── Expense / Finance ────────────────────────────────────────────────────────
export type ExpenseCategory = 'FUEL' | 'TOLL' | 'FOOD' | 'MAINTENANCE' | 'PARKING' | 'OTHER';

export interface Expense {
  id:          string;
  category:    ExpenseCategory;
  amount:      number;
  currency:    string;
  description: string;
  receiptUrl?: string;
  tripId:      string;
  status:      'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt:   string;
}

// ─── Vehicle Inspection ───────────────────────────────────────────────────────
export interface InspectionItem {
  id:       string;
  label:    string;
  category: 'SAFETY' | 'MECHANICAL' | 'DOCUMENTS' | 'TYRES';
  checked:  boolean;
  notes?:   string;
  photo?:   string;
}

export interface VehicleInspection {
  vehicleId:  string;
  tripId:     string;
  type:       'PRE_TRIP' | 'POST_TRIP';
  items:      InspectionItem[];
  odometer:   number;
  fuelLevel:  number;
  submittedAt?: string;
}

// ─── Notification ─────────────────────────────────────────────────────────────
export interface PushNotification {
  id:        string;
  title:     string;
  body:      string;
  type:      'TRIP' | 'EXPENSE' | 'ALERT' | 'CHAT' | 'SYSTEM';
  payload?:  Record<string, string>;
  readAt?:   string;
  createdAt: string;
}

// ─── Offline Queue ────────────────────────────────────────────────────────────
export type OfflineActionType =
  | 'UPDATE_TRIP_STATUS'
  | 'UPDATE_LOAD_STATUS'
  | 'LOCATION_PING'
  | 'UPLOAD_DOCUMENT'
  | 'SUBMIT_EXPENSE'
  | 'SUBMIT_INSPECTION';

export interface OfflineQueueItem {
  id:         string;
  action:     OfflineActionType;
  payload:    Record<string, unknown>;
  timestamp:  string;
  retries:    number;
  maxRetries: number;
}

// ─── Navigation Params ────────────────────────────────────────────────────────
export type RootStackParamList = {
  Splash:       undefined;
  Login:        undefined;
  OtpVerify:    { phone: string };
  BiometricAuth: undefined;
  MainTabs:     undefined;
  TripDetail:   { tripId: string };
  LoadDetail:   { loadId: string; tripId: string };
  DocumentCamera: { type: DocumentType; referenceId: string };
  DocumentPreview: { uri: string; type: DocumentType };
  ExpenseForm:  { tripId: string; prefillCategory?: ExpenseCategory };
  Inspection:   { vehicleId: string; tripId: string; type: 'PRE_TRIP' | 'POST_TRIP' };
  EmergencySOS: undefined;
  Notifications: undefined;
  Profile:      undefined;
  Settings:     undefined;
  FleetOverview: undefined;
};

export type TabParamList = {
  Dashboard:  undefined;
  Trips:      undefined;
  Documents:  undefined;
  Finance:    undefined;
  More:       undefined;
};
