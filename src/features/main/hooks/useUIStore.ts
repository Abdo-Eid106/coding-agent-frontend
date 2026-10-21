import { create } from "zustand";

export interface ProjectToDelete {
  id: string;
  name: string;
}

export interface SessionToDelete {
  id: string;
  title: string;
}

interface UIState {
  isSidebarOpen: boolean;
  isSettingsOpen: boolean;
  isAddProjectOpen: boolean;
  projectToDelete: ProjectToDelete | null;
  sessionToDelete: SessionToDelete | null;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openSettings: () => void;
  closeSettings: () => void;
  openAddProject: () => void;
  closeAddProject: () => void;
  openDeleteProject: (project: ProjectToDelete) => void;
  closeDeleteProject: () => void;
  openDeleteSession: (session: SessionToDelete) => void;
  closeDeleteSession: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  isSettingsOpen: false,
  isAddProjectOpen: false,
  projectToDelete: null,
  sessionToDelete: null,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ isSidebarOpen: open }),
  openSettings: () => set({ isSettingsOpen: true }),
  closeSettings: () => set({ isSettingsOpen: false }),
  openAddProject: () => set({ isAddProjectOpen: true }),
  closeAddProject: () => set({ isAddProjectOpen: false }),
  openDeleteProject: (project) => set({ projectToDelete: project }),
  closeDeleteProject: () => set({ projectToDelete: null }),
  openDeleteSession: (session) => set({ sessionToDelete: session }),
  closeDeleteSession: () => set({ sessionToDelete: null }),
}));
