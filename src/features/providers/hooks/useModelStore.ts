import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ModelState {
  selectedModelMap: Map<string, string>;
  toggleModelSelection: (params: {
    sessionId?: string;
    modelId: string;
  }) => void;
  getSelectedModel: (sessionId?: string) => string | undefined;
}

export const useModelStore = create<ModelState>()(
  persist(
    (set, get) => ({
      selectedModelMap: new Map(),

      toggleModelSelection: ({ sessionId = "default", modelId }) =>
        set((state) => {
          const nextMap = new Map(state.selectedModelMap);

          if (nextMap.get(sessionId) === modelId) {
            nextMap.delete(sessionId);
          } else {
            nextMap.set(sessionId, modelId);
          }

          return { selectedModelMap: nextMap };
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

      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState as {
          selectedModelMap?: [string, string][];
        }),
        selectedModelMap: new Map(
          (
            persistedState as {
              selectedModelMap?: [string, string][];
            }
          )?.selectedModelMap ?? [],
        ),
      }),
    },
  ),
);
