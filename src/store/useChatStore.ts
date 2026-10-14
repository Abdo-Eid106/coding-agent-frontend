import { create } from "zustand";
import type { ConversationTurn, Session } from "./types";
import { INITIAL_TURNS } from "./initialTurns";
import { createMockTurn } from "./mockAgent";
import { useProjectStore } from "./useProjectStore";

export const DEFAULT_MODEL = "Claude Opus 4.6 (Thinking)";

interface ChatState {
  currentSession: Session | null;
  selectedModel: string;

  setSession: (session: Session | null) => void;
  setSelectedModel: (model: string) => void;
  prependTurns: (olderTurns: ConversationTurn[]) => void;
  sendMessage: (userText: string) => void;
  newConversation: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  currentSession: {
    id: "initial-session",
    title: "Adding Summary Node …",
    turns: INITIAL_TURNS,
  },
  selectedModel: DEFAULT_MODEL,

  setSession: (session: Session | null) =>
    set({
      currentSession: session,
    }),

  setSelectedModel: (model: string) =>
    set({ selectedModel: model }),

  prependTurns: (olderTurns: ConversationTurn[]) =>
    set((state) => {
      if (!state.currentSession) return state;
      return {
        currentSession: {
          ...state.currentSession,
          turns: [...olderTurns, ...state.currentSession.turns],
        },
      };
    }),

  sendMessage: (userText: string) => {
    let session = get().currentSession;
    const { selectedModel } = get();

    if (!session) {
      const { selectedProjectId, addSession } = useProjectStore.getState();
      const sessionTitle =
        userText.length > 25 ? `${userText.slice(0, 22)}…` : userText;

      const sessionId = selectedProjectId
        ? addSession(selectedProjectId, sessionTitle)
        : crypto.randomUUID();

      session = {
        id: sessionId,
        title: sessionTitle,
        turns: [],
      };
    }

    const newTurn = createMockTurn(userText, selectedModel, session.id);
    const updatedTurns = [...session.turns, newTurn];

    set({
      currentSession: { ...session, turns: updatedTurns },
    });
  },

  newConversation: () =>
    set({
      currentSession: null,
    }),
}));
