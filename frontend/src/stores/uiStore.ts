import { create } from 'zustand';

interface UIState {
  composerOpen: boolean;
  setComposerOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  composerOpen: false,
  setComposerOpen: (open) => set({ composerOpen: open }),
}));