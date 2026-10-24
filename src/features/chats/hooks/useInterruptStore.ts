import { create } from "zustand";
import { type Interrupt } from "../types";

export interface InterruptsState {
  interruptsMap: Map<string, Interrupt>;
  addInterrupt: (messageId: string, interrupt: Interrupt) => void;
  removeInterrupt: (messageId: string) => void;
  getInterrupt: (messageId: string) => Interrupt | undefined;
}

export const useInterruptsStore = create<InterruptsState>((set, get) => ({
  interruptsMap: new Map(),

  addInterrupt: (messageId, interrupt) =>
    set((state) => {
      const interruptsMap = new Map(state.interruptsMap);
      interruptsMap.set(messageId, interrupt);

      return { interruptsMap };
    }),

  removeInterrupt: (messageId) =>
    set((state) => {
      const interruptsMap = new Map(state.interruptsMap);
      interruptsMap.delete(messageId);

      return { interruptsMap };
    }),

  getInterrupt: (messageId) => get().interruptsMap.get(messageId),
}));
