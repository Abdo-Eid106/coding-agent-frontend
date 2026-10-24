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
  // Modal states
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  setIsSettingsOpen: (open: boolean) => void;

  projectToDelete: ProjectToDelete | null;
  isDeleteProjectOpen: boolean;
  openDeleteProject: (project: ProjectToDelete) => void;
  closeDeleteProject: () => void;

  sessionToDelete: SessionToDelete | null;
  isDeleteSessionOpen: boolean;
  openDeleteSession: (session: SessionToDelete) => void;
  closeDeleteSession: () => void;

  // Sidebar section collapse states
  isProjectsOpen: boolean;
  setIsProjectsOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  toggleProjectsOpen: () => void;

  isConversationsOpen: boolean;
  setIsConversationsOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  toggleConversationsOpen: () => void;

  ensureSessionVisible: (
    sessionId?: string,
    data?: {
      projects?: Array<{ sessions?: Array<{ id: string }> }>;
      sessions?: Array<{ id: string }>;
    },
  ) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSettingsOpen: false,
  openSettings: () => set({ isSettingsOpen: true }),
  closeSettings: () => set({ isSettingsOpen: false }),
  setIsSettingsOpen: (open) => set({ isSettingsOpen: open }),

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

  isProjectsOpen: true,
  setIsProjectsOpen: (open) =>
    set((state) => ({
      isProjectsOpen:
        typeof open === "function" ? open(state.isProjectsOpen) : open,
    })),
  toggleProjectsOpen: () =>
    set((state) => ({ isProjectsOpen: !state.isProjectsOpen })),

  isConversationsOpen: true,
  setIsConversationsOpen: (open) =>
    set((state) => ({
      isConversationsOpen:
        typeof open === "function" ? open(state.isConversationsOpen) : open,
    })),
  toggleConversationsOpen: () =>
    set((state) => ({ isConversationsOpen: !state.isConversationsOpen })),

  ensureSessionVisible: (sessionId, data) => {
    if (!sessionId || !data) return;

    const isStandalone = data.sessions?.some((s) => s.id === sessionId);
    if (isStandalone) {
      set((state) =>
        state.isConversationsOpen ? state : { isConversationsOpen: true },
      );
      return;
    }

    const inProject = data.projects?.some((p) =>
      p.sessions?.some((s) => s.id === sessionId),
    );
    if (inProject) {
      set((state) =>
        state.isProjectsOpen ? state : { isProjectsOpen: true },
      );
    }
  },
}));
