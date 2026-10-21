import { create } from "zustand";

export interface ProjectState {
  selectedProjectId: string | null;
  setSelectedProjectId: (projectId: string | null) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  selectedProjectId: null,
  setSelectedProjectId: (projectId: string | null) =>
    set({ selectedProjectId: projectId }),
}));
