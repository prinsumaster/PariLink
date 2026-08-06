// ─────────────────────────────────────────────────────────────────────────────
// PariLink Mobile — Unit Tests
// Tests cover: OCR parsing, offline queue, auth slice, utility helpers.
// ─────────────────────────────────────────────────────────────────────────────

// ── Test: OCR Text Parser ─────────────────────────────────────────────────────
import { parseOcrText } from '../src/services/ocr/OcrService';
import { generateUUID, formatINR, calculateDistance } from '../src/utils/helpers';

jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(),
  addEventListener: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

jest.mock('@react-native-firebase/app', () => ({}));
jest.mock('@react-native-firebase/messaging', () => ({}));

describe('OcrService — parseOcrText', () => {
  it('extracts INR amount from fuel receipt', () => {
    const text = 'HPCL Petrol Pump\nDate: 28/07/2026\nINR 3,450.00\nDiesel: 25.5L';
    const result = parseOcrText(text);
    expect(result.amount).toBe(3450);
    expect(result.currency).toBe('INR');
    expect(result.date).toBe('28/07/2026');
    expect(result.fuelLitres).toBe(25.5);
  });

  it('extracts ₹ symbol amounts', () => {
    const text = 'Total: ₹1,200.50';
    const result = parseOcrText(text);
    expect(result.amount).toBe(1200.5);
  });

  it('extracts invoice number', () => {
    const text = 'Invoice #INV-2026-001\nAmount: Rs. 5000';
    const result = parseOcrText(text);
    expect(result.invoiceNo).toBeDefined();
    expect(result.amount).toBe(5000);
  });

  it('returns empty extracted for unrecognized text', () => {
    const result = parseOcrText('Hello World — no financial data here');
    expect(result.amount).toBeUndefined();
    expect(result.date).toBeUndefined();
  });
});

// ── Test: Utility Helpers ─────────────────────────────────────────────────────
describe('Helpers', () => {
  it('generateUUID produces a valid v4 UUID format', () => {
    const uuid = generateUUID();
    expect(uuid).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('generateUUID produces unique values', () => {
    const ids = new Set(Array.from({ length: 1000 }, () => generateUUID()));
    expect(ids.size).toBe(1000);
  });

  it('formatINR formats correctly', () => {
    const result = formatINR(125000);
    expect(result).toContain('1,25,000');
  });

  it('calculateDistance returns 0 for same point', () => {
    const dist = calculateDistance(28.6139, 77.2090, 28.6139, 77.2090);
    expect(dist).toBe(0);
  });

  it('calculateDistance returns approximate km between Delhi and Mumbai', () => {
    // Delhi: 28.6139, 77.2090 / Mumbai: 19.0760, 72.8777
    const dist = calculateDistance(28.6139, 77.2090, 19.0760, 72.8777);
    expect(dist).toBeGreaterThan(1100); // ~1150 km
    expect(dist).toBeLessThan(1300);
  });
});

// ── Test: Auth Slice ──────────────────────────────────────────────────────────
import authReducer, { clearAuth, setOfflineMode } from '../src/store/slices/authSlice';

describe('authSlice', () => {
  const initialState = {
    accessToken:        null,
    user:               null,
    isLoading:          false,
    isOffline:          false,
    biometricAvailable: false,
  };

  it('clearAuth resets auth state', () => {
    const state = {
      ...initialState,
      accessToken: 'some.jwt.token',
      user: { userId: '1', companyId: 'c1', email: 'a@b.com', name: 'Test', role: 'DRIVER' },
    };
    const newState = authReducer(state, clearAuth());
    expect(newState.accessToken).toBeNull();
    expect(newState.user).toBeNull();
  });

  it('setOfflineMode sets offline flag', () => {
    const newState = authReducer(initialState, setOfflineMode(true));
    expect(newState.isOffline).toBe(true);
  });
});

// ── Test: Trips Slice ─────────────────────────────────────────────────────────
import tripsReducer, { setTracking, optimisticUpdateTripStatus } from '../src/store/slices/tripsSlice';

describe('tripsSlice', () => {
  const initialState = {
    activeTrip:  null,
    isLoading:   false,
    isTracking:  false,
    error:       null,
    lastSyncAt:  null,
  };

  it('setTracking updates tracking state', () => {
    const state = tripsReducer(initialState, setTracking(true));
    expect(state.isTracking).toBe(true);
  });

  it('optimisticUpdateTripStatus updates status when trip exists', () => {
    const stateWithTrip = {
      ...initialState,
      activeTrip: {
        id: 'trip1', tripNo: 'T001', status: 'DISPATCHED' as const,
        vehicle: { id: 'v1', regNo: 'MH-01-AB-1234', vehicleType: 'TRUCK' },
        loads: [],
      },
    };
    const newState = tripsReducer(stateWithTrip, optimisticUpdateTripStatus('IN_PROGRESS'));
    expect(newState.activeTrip?.status).toBe('IN_PROGRESS');
  });
});
