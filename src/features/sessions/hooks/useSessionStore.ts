import { create } from "zustand";

export interface SessionToDelete {
  id: string;
  title?: string | null;
}

export interface SessionState {
  sessionToDelete: SessionToDelete | null;
  openDeleteSession: (session: SessionToDelete) => void;
  closeDeleteSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  sessionToDelete: null,
  openDeleteSession: (session) => set({ sessionToDelete: session }),
  closeDeleteSession: () => set({ sessionToDelete: null }),
}));
