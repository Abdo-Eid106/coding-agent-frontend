import { create } from "zustand";

export const DEFAULT_MODEL = "Claude Opus 4.6 (Thinking)";
export const DEFAULT_MODEL_ID = "00000000-0000-4000-8000-000000000003";

interface ChatState {
  currentSessionId: string | null;
  currentSessionTitle: string | null;
  selectedModel: string;
  selectedModelId: string;

  setCurrentSessionId: (
    sessionId: string | null,
    title?: string | null
  ) => void;
  setSelectedModel: (model: string, modelId?: string) => void;
  newConversation: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  currentSessionId: null,
  currentSessionTitle: null,
  selectedModel: DEFAULT_MODEL,
  selectedModelId: DEFAULT_MODEL_ID,

  setCurrentSessionId: (sessionId: string | null, title?: string | null) =>
    set({
      currentSessionId: sessionId,
      currentSessionTitle: title ?? null,
    }),

  setSelectedModel: (model: string, modelId?: string) =>
    set((state) => ({
      selectedModel: model,
      selectedModelId: modelId ?? state.selectedModelId,
    })),

  newConversation: () =>
    set({
      currentSessionId: null,
      currentSessionTitle: null,
    }),
}));
