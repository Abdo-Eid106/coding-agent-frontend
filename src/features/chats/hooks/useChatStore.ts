import { create } from "zustand";

export const DEFAULT_MODEL = "Claude Opus 4.6 (Thinking)";
export const DEFAULT_MODEL_ID = "00000000-0000-4000-8000-000000000003";

interface ChatState {
  selectedModel: string;
  selectedModelId: string;

  setSelectedModel: (model: string, modelId?: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  selectedModel: DEFAULT_MODEL,
  selectedModelId: DEFAULT_MODEL_ID,

  setSelectedModel: (model: string, modelId?: string) =>
    set((state) => ({
      selectedModel: model,
      selectedModelId: modelId ?? state.selectedModelId,
    })),
}));
