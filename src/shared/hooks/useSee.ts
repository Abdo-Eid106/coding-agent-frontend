import { useEffect } from "react";
import { toast } from "sonner";
import {
  agentHandlers,
  handleAgentError,
} from "../../features/chats/hooks/useMessages";
import { useQueryClient } from "@tanstack/react-query";
import { activeSessionsKey } from "../../features/sessions/hooks/session.queries";
import { SessionStatus } from "../../features/sessions/enums/session-status";
import type { SessionEvent } from "../../features/sessions/types";

const API_URL = import.meta.env.VITE_API_URL;

export function useSSE() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const es = new EventSource(`${API_URL}/events`);

    Object.entries(agentHandlers).forEach(([type, handler]) => {
      es.addEventListener(type, (e) => {
        handler(queryClient, JSON.parse((e as MessageEvent).data));
      });
    });

    es.addEventListener("session_status", (e) => {
      try {
        const event = JSON.parse((e as MessageEvent).data) as SessionEvent;
        if (event.status === SessionStatus.RUNNING) {
          queryClient.setQueryData<string[]>(activeSessionsKey, (old = []) =>
            old.includes(event.sessionId) ? old : [...old, event.sessionId],
          );
        } else {
          queryClient.setQueryData<string[]>(activeSessionsKey, (old = []) =>
            old.filter((sessionId) => sessionId !== event.sessionId),
          );
        }
      } catch (err) {
        console.error("Failed to parse session_status event", err);
      }
    });

    // "error" is used by both the server and the browser
    es.addEventListener("error", (e) => {
      const msg = e as MessageEvent;

      if (typeof msg.data === "string") {
        handleAgentError(JSON.parse(msg.data));
        return;
      }

      toast.error(
        es.readyState === EventSource.CLOSED
          ? "SSE connection closed."
          : "SSE connection lost. Reconnecting...",
      );
    });

    return () => es.close();
  }, [queryClient]);
}
