import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ModelState {
  selectedModelMap: Map<string, string>;
  selectModel: (params: { sessionId?: string; modelId: string }) => void;
  getSelectedModel: (sessionId?: string) => string | undefined;
}

export const useModelStore = create<ModelState>()(
  persist(
    (set, get) => ({
      selectedModelMap: new Map(),

      selectModel: ({ sessionId = "default", modelId }) =>
        set((state) => {
          const selectedModelMap = new Map(state.selectedModelMap);
          selectedModelMap.set(sessionId, modelId);

          return { selectedModelMap };
        }),

      getSelectedModel: (sessionId = "default") =>
        get().selectedModelMap.get(sessionId),
    }),
    {
      name: "model-selection-storage",
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        selectedModelMap: Array.from(state.selectedModelMap.entries()),
      }),

      merge: (persistedState, currentState) => {
        const persisted = persistedState as {
          selectedModelMap?: [string, string][];
        };

        return {
          ...currentState,
          selectedModelMap: new Map(persisted?.selectedModelMap ?? []),
        };
      },
    },
  ),
);
