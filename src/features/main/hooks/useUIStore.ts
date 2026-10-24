import { create } from "zustand";

export interface ProjectToDelete {
  id: string;
  name: string;
}

export interface SessionToDelete {
  id: string;
  title?: string | null;
}

interface UIState {
  projectToDelete: ProjectToDelete | null;
  isDeleteProjectOpen: boolean;
  openDeleteProject: (project: ProjectToDelete) => void;
  closeDeleteProject: () => void;

  sessionToDelete: SessionToDelete | null;
  isDeleteSessionOpen: boolean;
  openDeleteSession: (session: SessionToDelete) => void;
  closeDeleteSession: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  projectToDelete: null,
  isDeleteProjectOpen: false,
  openDeleteProject: (project) =>
    set({ projectToDelete: project, isDeleteProjectOpen: true }),
  closeDeleteProject: () => set({ isDeleteProjectOpen: false }),

  sessionToDelete: null,
  isDeleteSessionOpen: false,
  openDeleteSession: (session) =>
    set({ sessionToDelete: session, isDeleteSessionOpen: true }),
  closeDeleteSession: () => set({ isDeleteSessionOpen: false }),
}));
