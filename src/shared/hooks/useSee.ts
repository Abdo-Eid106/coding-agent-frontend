import { useEffect } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { activeSessionsKey } from "../../features/sessions/hooks/session.queries";
import { SessionStatus } from "../../features/sessions/enums/session-status";
import type { SessionEvent } from "../../features/sessions/types";
import {
  AgentEventEnum,
  type AgentErrorEvent,
  type TokenEvent,
  type ToolCallEvent,
} from "../../types/agent-stream-event";
import { addToolCall } from "../../features/tools/helpers/addToolCall";
import { addToken } from "../../features/chats/hooks/useMessages";

const API_URL = import.meta.env.VITE_API_URL;

export function useSSE() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const es = new EventSource(`${API_URL}/events`);

    es.addEventListener(AgentEventEnum.TOKEN, (e) => {
      alert("TOkEN EVENT is " + JSON.stringify(e));
      addToken(queryClient, e.data as TokenEvent);
    });

    es.addEventListener(AgentEventEnum.TOOL_START, (e) => {
      addToolCall(queryClient, e.data as ToolCallEvent);
    });

    es.addEventListener(AgentEventEnum.TOOL_END, (e) => {
      addToolCall(queryClient, e.data as ToolCallEvent);
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
        toast.error((JSON.parse(msg.data) as AgentErrorEvent).error);
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
