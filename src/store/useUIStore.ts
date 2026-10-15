import { create } from "zustand";

export interface ProjectToDelete {
  id: string;
  name: string;
}

interface UIState {
  isSidebarOpen: boolean;
  isSettingsOpen: boolean;
  isAddProjectOpen: boolean;
  projectToDelete: ProjectToDelete | null;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openSettings: () => void;
  closeSettings: () => void;
  openAddProject: () => void;
  closeAddProject: () => void;
  openDeleteProject: (project: ProjectToDelete) => void;
  closeDeleteProject: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  isSettingsOpen: false,
  isAddProjectOpen: false,
  projectToDelete: null,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ isSidebarOpen: open }),
  openSettings: () => set({ isSettingsOpen: true }),
  closeSettings: () => set({ isSettingsOpen: false }),
  openAddProject: () => set({ isAddProjectOpen: true }),
  closeAddProject: () => set({ isAddProjectOpen: false }),
  openDeleteProject: (project) => set({ projectToDelete: project }),
  closeDeleteProject: () => set({ projectToDelete: null }),
}));
