import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface Vehicle {
  id: string;
  latitude: number;
  longitude: number;
  speed: number;
  fuelLevel?: number;
  status: string;
  driverId?: string;
}

interface EventStreamItem {
  id: string;
  type: string;
  vehicleId: string;
  geofenceName?: string;
  timestamp: string;
}

interface ExceptionAlert {
  id: string;
  alertId: string;
  ruleType: string;
  timestamp: string;
}

interface ControlTowerState {
  socket: Socket | null;
  isConnected: boolean;
  vehicles: Record<string, Vehicle>;
  events: EventStreamItem[];
  exceptions: ExceptionAlert[];
  
  connect: (companyId: string) => void;
  disconnect: () => void;
  updateVehicle: (vehicle: Vehicle) => void;
  addEvent: (event: EventStreamItem) => void;
  addException: (exception: ExceptionAlert) => void;
}

export const useControlTowerStore = create<ControlTowerState>((set, get) => ({
  socket: null,
  isConnected: false,
  vehicles: {},
  events: [],
  exceptions: [],

  connect: (companyId: string) => {
    if (get().socket) return; // Already connected

    // Use environment variable for backend URL in production
    const socketUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8080/telemetry';
    
    const socket = io(socketUrl, {
      query: { companyId },
      transports: ['websocket'],
      reconnectionAttempts: 10,
    });

    socket.on('connect', () => {
      set({ isConnected: true });
    });

    socket.on('disconnect', () => {
      set({ isConnected: false });
    });

    socket.on('vehicle_update', (data: Vehicle) => {
      get().updateVehicle(data);
    });

    socket.on('event_stream', (data: EventStreamItem) => {
      get().addEvent({ ...data, id: Date.now().toString() + Math.random() });
    });

    socket.on('exception_alert', (data: ExceptionAlert) => {
      get().addException({ ...data, id: Date.now().toString() + Math.random() });
    });

    set({ socket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  updateVehicle: (vehicle: Vehicle) => {
    set((state) => ({
      vehicles: {
        ...state.vehicles,
        [vehicle.id]: vehicle,
      },
    }));
  },

  addEvent: (event: EventStreamItem) => {
    set((state) => ({
      // Keep only last 100 events
      events: [event, ...state.events].slice(0, 100),
    }));
  },

  addException: (exception: ExceptionAlert) => {
    set((state) => ({
      exceptions: [exception, ...state.exceptions],
    }));
  },
}));
