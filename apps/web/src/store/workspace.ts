import { create } from 'zustand';

interface WorkspaceState {
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
  layoutDensity: 'compact' | 'balanced';
  setLayoutDensity: (density: 'compact' | 'balanced') => void;
  isContextBarOpen: boolean;
  setContextBarOpen: (open: boolean) => void;
  toggleContextBar: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  isCommandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
  layoutDensity: 'balanced',
  setLayoutDensity: (density) => set({ layoutDensity: density }),
  isContextBarOpen: false,
  setContextBarOpen: (open) => set({ isContextBarOpen: open }),
  toggleContextBar: () => set((state) => ({ isContextBarOpen: !state.isContextBarOpen })),
}));
