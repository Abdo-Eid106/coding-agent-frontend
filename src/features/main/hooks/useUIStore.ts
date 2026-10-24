import { create } from "zustand";

interface UIState {
  isSidebarOpen: boolean;
  isSettingsOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openSettings: () => void;
  closeSettings: () => void;
}

const isDesktop =
  typeof window !== "undefined" ? window.innerWidth >= 768 : true;

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: isDesktop,
  isSettingsOpen: false,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ isSidebarOpen: open }),
  openSettings: () => set({ isSettingsOpen: true }),
  closeSettings: () => set({ isSettingsOpen: false }),
}));
