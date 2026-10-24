import { create } from "zustand";

interface SidebarState {
  isProjectsOpen: boolean;
  setIsProjectsOpen: (open: boolean) => void;
  toggleProjectsOpen: () => void;

  isConversationsOpen: boolean;
  setIsConversationsOpen: (open: boolean) => void;
  toggleConversationsOpen: () => void;

  ensureSessionVisible: (
    sessionId?: string,
    data?: {
      projects?: Array<{ sessions?: Array<{ id: string }> }>;
      sessions?: Array<{ id: string }>;
    },
  ) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isProjectsOpen: true,
  setIsProjectsOpen: (open) => set(() => ({ isProjectsOpen: open })),
  toggleProjectsOpen: () =>
    set((state) => ({ isProjectsOpen: !state.isProjectsOpen })),

  isConversationsOpen: true,
  setIsConversationsOpen: (open) => set(() => ({ isConversationsOpen: open })),
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
      set((state) => (state.isProjectsOpen ? state : { isProjectsOpen: true }));
    }
  },
}));
