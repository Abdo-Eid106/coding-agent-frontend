import { create } from "zustand";

export interface SettingsState {
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  setIsSettingsOpen: (open: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  isSettingsOpen: false,
  openSettings: () => set({ isSettingsOpen: true }),
  closeSettings: () => set({ isSettingsOpen: false }),
  setIsSettingsOpen: (open) => set({ isSettingsOpen: open }),
}));
