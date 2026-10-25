import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SidebarState {
  openedProjects: Set<string>;

  isProjectsOpen: boolean;
  isConversationsOpen: boolean;

  openProject: (projectId: string) => void;
  closeProject: (projectId: string) => void;
  toggleProject: (projectId: string) => void;

  openProjects: () => void;
  closeProjects: () => void;
  toggleProjects: () => void;

  openConversations: () => void;
  closeConversations: () => void;
  toggleConversations: () => void;

  isProjectOpen: (projectId: string) => boolean;
}

interface PersistedSidebarState {
  openedProjects: string[];
  isProjectsOpen: boolean;
  isConversationsOpen: boolean;
}

const addToSet = (set: Set<string>, id: string): Set<string> => {
  if (set.has(id)) return set;
  return new Set(set).add(id);
};

const removeFromSet = (set: Set<string>, id: string): Set<string> => {
  if (!set.has(id)) return set;
  const next = new Set(set);
  next.delete(id);
  return next;
};

const toggleInSet = (set: Set<string>, id: string): Set<string> =>
  set.has(id) ? removeFromSet(set, id) : addToSet(set, id);

export const useSidebarStore = create<SidebarState>()(
  persist<SidebarState, [], [], PersistedSidebarState>(
    (set, get) => ({
      openedProjects: new Set(),

      isProjectsOpen: true,
      isConversationsOpen: true,

      openProject: (projectId) =>
        set((state) => ({
          openedProjects: addToSet(state.openedProjects, projectId),
        })),

      closeProject: (projectId) =>
        set((state) => ({
          openedProjects: removeFromSet(state.openedProjects, projectId),
        })),

      toggleProject: (projectId) =>
        set((state) => ({
          openedProjects: toggleInSet(state.openedProjects, projectId),
        })),

      openProjects: () => set({ isProjectsOpen: true }),
      closeProjects: () => set({ isProjectsOpen: false }),
      toggleProjects: () =>
        set((state) => ({ isProjectsOpen: !state.isProjectsOpen })),

      openConversations: () => set({ isConversationsOpen: true }),
      closeConversations: () => set({ isConversationsOpen: false }),
      toggleConversations: () =>
        set((state) => ({ isConversationsOpen: !state.isConversationsOpen })),

      isProjectOpen: (projectId) => get().openedProjects.has(projectId),
    }),
    {
      name: "sidebar-storage",
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        openedProjects: [...state.openedProjects],
        isProjectsOpen: state.isProjectsOpen,
        isConversationsOpen: state.isConversationsOpen,
      }),

      merge: (persisted, current) => {
        const saved = persisted as Partial<PersistedSidebarState> | undefined;

        return {
          ...current,
          openedProjects: new Set(saved?.openedProjects),
          isProjectsOpen: saved?.isProjectsOpen ?? true,
          isConversationsOpen: saved?.isConversationsOpen ?? true,
        };
      },
    },
  ),
);
