import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WorkspaceTab {
  id: string;          // Unique ID (e.g. "load-201", "trips")
  title: string;       // Display name
  type: string;        // Component to render (e.g. "LoadDetails", "TripList")
  url: string;         // Virtual URL for the tab
  icon?: any;          // Lucide icon name or component
  isDirty?: boolean;   // Unsaved changes
  data?: any;          // Initial data (like entity ID)
}

export interface WorkspacePanel {
  id: string;          // "ai", "comments", "files", "history"
  title: string;
  isOpen: boolean;
  width: number;
}

export interface WorkspaceOverlay {
  id: string;
  type: 'sheet' | 'drawer' | 'inspector' | 'dialog';
  component: string;
  title?: string;
  props?: any;
  isOpen: boolean;
}

interface WorkspaceKernelState {
  // Tabs
  tabs: WorkspaceTab[];
  activeTabId: string | null;
  openTab: (tab: WorkspaceTab) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  closeAllTabs: () => void;
  closeOtherTabs: (id: string) => void;

  // Split View (Horizontal/Vertical)
  splitMode: 'single' | 'horizontal' | 'vertical';
  setSplitMode: (mode: 'single' | 'horizontal' | 'vertical') => void;
  secondaryTabId: string | null; // The tab shown in the split view
  setSecondaryTab: (id: string | null) => void;

  // Docked Panels
  panels: WorkspacePanel[];
  togglePanel: (id: string) => void;
  setPanelWidth: (id: string, width: number) => void;
  closeAllPanels: () => void;

  // Bottom Bar
  isBottomBarOpen: boolean;
  activeBottomTab: 'logs' | 'jobs' | 'downloads' | 'notifications';
  toggleBottomBar: (tab?: 'logs' | 'jobs' | 'downloads' | 'notifications') => void;

  // Overlays (Workflows without page navigation)
  overlays: WorkspaceOverlay[];
  openOverlay: (overlay: Omit<WorkspaceOverlay, 'isOpen'>) => void;
  closeOverlay: (id: string) => void;
  closeAllOverlays: () => void;

  // UI State
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const DEFAULT_PANELS: WorkspacePanel[] = [
  { id: 'ai', title: 'AI Copilot', isOpen: false, width: 320 },
  { id: 'comments', title: 'Comments', isOpen: false, width: 320 },
  { id: 'files', title: 'Files', isOpen: false, width: 320 },
  { id: 'history', title: 'History', isOpen: false, width: 320 },
];

export const useWorkspaceKernelStore = create<WorkspaceKernelState>()(
  persist(
    (set, get) => ({
      // Tabs
      tabs: [],
      activeTabId: null,
      
      openTab: (tab) => set((state) => {
        const exists = state.tabs.find((t) => t.id === tab.id);
        if (exists) {
          return { activeTabId: tab.id };
        }
        return {
          tabs: [...state.tabs, tab],
          activeTabId: tab.id,
        };
      }),

      closeTab: (id) => set((state) => {
        const newTabs = state.tabs.filter((t) => t.id !== id);
        let newActiveId = state.activeTabId;
        if (state.activeTabId === id) {
          newActiveId = newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null;
        }
        return {
          tabs: newTabs,
          activeTabId: newActiveId,
          secondaryTabId: state.secondaryTabId === id ? null : state.secondaryTabId,
        };
      }),

      setActiveTab: (id) => set({ activeTabId: id }),
      closeAllTabs: () => set({ tabs: [], activeTabId: null, secondaryTabId: null }),
      closeOtherTabs: (id) => set((state) => ({
        tabs: state.tabs.filter((t) => t.id === id),
        activeTabId: id,
        secondaryTabId: state.secondaryTabId === id ? id : null,
      })),

      // Split View
      splitMode: 'single',
      setSplitMode: (mode) => set({ splitMode: mode }),
      secondaryTabId: null,
      setSecondaryTab: (id) => set({ secondaryTabId: id }),

      // Panels
      panels: DEFAULT_PANELS,
      togglePanel: (id) => set((state) => ({
        panels: state.panels.map((p) => 
          p.id === id ? { ...p, isOpen: !p.isOpen } : { ...p, isOpen: false } // Only allow one panel open at a time for now
        )
      })),
      setPanelWidth: (id, width) => set((state) => ({
        panels: state.panels.map((p) => p.id === id ? { ...p, width } : p)
      })),
      closeAllPanels: () => set((state) => ({
        panels: state.panels.map((p) => ({ ...p, isOpen: false }))
      })),

      // Bottom Bar
      isBottomBarOpen: false,
      activeBottomTab: 'logs',
      toggleBottomBar: (tab) => set((state) => {
        if (tab && state.isBottomBarOpen && state.activeBottomTab === tab) {
          return { isBottomBarOpen: false };
        }
        return {
          isBottomBarOpen: true,
          activeBottomTab: tab || state.activeBottomTab
        };
      }),

      // Overlays
      overlays: [],
      openOverlay: (overlay) => set((state) => {
        if (state.overlays.some(o => o.id === overlay.id)) return state;
        return { overlays: [...state.overlays, { ...overlay, isOpen: true }] };
      }),
      closeOverlay: (id) => set((state) => ({
        overlays: state.overlays.filter(o => o.id !== id)
      })),
      closeAllOverlays: () => set({ overlays: [] }),

      // UI State
      isCommandPaletteOpen: false,
      setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
      isSearchOpen: false,
      setSearchOpen: (open) => set({ isSearchOpen: open }),
      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
    }),
    {
      name: 'parilink-workspace-kernel',
      partialize: (state) => ({
        tabs: state.tabs,
        activeTabId: state.activeTabId,
        panels: state.panels,
        splitMode: state.splitMode,
        secondaryTabId: state.secondaryTabId,
        sidebarCollapsed: state.sidebarCollapsed,
      }), // Persist these fields across reloads
    }
  )
);
