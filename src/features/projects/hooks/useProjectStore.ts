import { create } from "zustand";

export interface ProjectToDelete {
  id: string;
  name: string;
}

export interface ProjectState {
  selectedProjectId: string | null;
  setSelectedProjectId: (projectId: string | null) => void;

  projectToDelete: ProjectToDelete | null;
  openDeleteProject: (project: ProjectToDelete) => void;
  closeDeleteProject: () => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  selectedProjectId: null,
  setSelectedProjectId: (projectId: string | null) =>
    set({ selectedProjectId: projectId }),

  projectToDelete: null,
  openDeleteProject: (project) => set({ projectToDelete: project }),
  closeDeleteProject: () => set({ projectToDelete: null }),
}));
