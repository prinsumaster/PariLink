import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, Tenant } from '@/types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  tenantId: string | null;
  activeTenant: Tenant | null;
  isAuthenticated: boolean;
  
  setAuth: (user: User, token: string, tenantId?: string) => void;
  setToken: (token: string) => void;
  setTenant: (tenant: Tenant) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

// Custom storage engine that strictly couples localStorage to the cookie state
const customStorage = {
  getItem: (name: string) => {
    if (typeof window === 'undefined') return null;
    const value = localStorage.getItem(name);
    if (!value) return null;
    
    // Validate against cookie
    const hasCookie = typeof document !== 'undefined' && document.cookie.includes('logged_in=true');
    if (!hasCookie) {
      localStorage.removeItem(name);
      return null; // Force Zustand to initialize with empty state
    }
    
    return value;
  },
  setItem: (name: string, value: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(name, value);
  },
  removeItem: (name: string) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      tenantId: null,
      activeTenant: null,
      isAuthenticated: false,
      
      setAuth: (user, token, tenantId) => {
        set({
          user,
          token,
          tenantId: tenantId || user.defaultTenantId || null,
          isAuthenticated: true,
        });
      },
      
      setToken: (token) => {
        set({ token });
      },
      
      setTenant: (tenant) => set({ 
        activeTenant: tenant,
        tenantId: tenant.id
      }),
      
      logout: () => {
        if (typeof document !== 'undefined') {
          document.cookie = 'logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
        set({
          user: null,
          token: null,
          tenantId: null,
          activeTenant: null,
          isAuthenticated: false,
        });
      },
      
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),
    }),
    {
      name: 'parilink-auth',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? customStorage : (undefined as any))),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        tenantId: state.tenantId,
        activeTenant: state.activeTenant,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Cross-tab synchronization
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'parilink-auth') {
      useAuthStore.persist.rehydrate();
    }
  });
}
