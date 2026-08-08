import { create } from 'zustand';
import { RealtimeEvent } from '@/hooks/use-realtime-engine';

export interface ActivityItem extends RealtimeEvent {
  isRead: boolean;
  isDismissed: boolean;
}

interface ActivityState {
  activities: ActivityItem[];
  addActivity: (event: RealtimeEvent) => void;
  markAsRead: (id: string) => void;
  dismissActivity: (id: string) => void;
  clearAll: () => void;
}

export const useActivityStore = create<ActivityState>((set) => ({
  activities: [],

  addActivity: (event) => set((state) => {
    // Prevent duplicates by correlationId/id
    if (state.activities.some(a => a.id === event.id)) {
      return state;
    }
    
    // Add to top of list, keeping max 100 items in memory
    const newActivities = [
      { ...event, isRead: false, isDismissed: false },
      ...state.activities
    ].slice(0, 100);
    
    return { activities: newActivities };
  }),

  markAsRead: (id) => set((state) => ({
    activities: state.activities.map(a => 
      a.id === id ? { ...a, isRead: true } : a
    )
  })),

  dismissActivity: (id) => set((state) => ({
    activities: state.activities.map(a => 
      a.id === id ? { ...a, isDismissed: true } : a
    )
  })),

  clearAll: () => set({ activities: [] }),
}));
