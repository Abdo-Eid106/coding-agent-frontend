import { create } from "zustand";
import type { ConversationTurn } from "./types";
import { INITIAL_TURNS } from "./initialTurns";
import { createMockTurn } from "./mockAgent";

interface ChatState {
  turns: ConversationTurn[];
  sendMessage: (userText: string, model: string) => void;
  newConversation: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  turns: INITIAL_TURNS,

  sendMessage: (userText: string, model: string) =>
    set((state) => {
      const newTurn = createMockTurn(userText, model);
      return { turns: [...state.turns, newTurn] };
    }),

  newConversation: () => set({ turns: [] }),
}));
