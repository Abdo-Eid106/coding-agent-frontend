import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  type TokenEvent,
  type AgentStreamEvent,
  AgentEventEnum,
  type AgentErrorEvent,
  type SessionEvent,
  type ToolCallEvent,
} from "../../types/agent-stream-event";

import {
  addToken,
  finishMessage,
} from "../../features/chats/hooks/useMessages";

import { SessionStatus } from "@/features/sessions/types";
import { useActiveSessions } from "../../features/sessions/hooks/session.queries";
import { addToolCall } from "../../features/tools/helpers/addToolCall";

const API_URL = import.meta.env.VITE_API_URL;

function handleEvent<T>(event: Event, handler: (data: T) => void) {
  try {
    const data = JSON.parse((event as MessageEvent<string>).data) as T;
    handler(data);
  } catch (err) {
    console.error(err);
  }
}

export const useSSE = () => {
  const queryClient = useQueryClient();
  const { addActiveSession, removeActiveSession } = useActiveSessions();

  useEffect(() => {
    const es = new EventSource(`${API_URL}/events`);

    const onToken = (e: Event) =>
      handleEvent<TokenEvent>(e, (event) => addToken(queryClient, event));

    const onDone = (e: Event) =>
      handleEvent<AgentStreamEvent>(e, (event) =>
        finishMessage(queryClient, event),
      );

    const onAgentError = (e: Event) =>
      handleEvent<AgentErrorEvent>(e, (event) => toast.error(event.error));

    const onToolStart = (e: Event) =>
      handleEvent<ToolCallEvent>(e, (event) => addToolCall(queryClient, event));

    const onToolEnd = (e: Event) =>
      handleEvent<ToolCallEvent>(e, (event) => addToolCall(queryClient, event));

    const onSessionStatus = (e: Event) =>
      handleEvent<SessionEvent>(e, (event) => {
        if (event.status === SessionStatus.RUNNING) {
          addActiveSession(event.sessionId);
        } else {
          removeActiveSession(event.sessionId);
        }
      });

    es.addEventListener(AgentEventEnum.TOKEN, onToken);
    es.addEventListener(AgentEventEnum.DONE, onDone);
    es.addEventListener(AgentEventEnum.SESSION_STATUS, onSessionStatus);
    es.addEventListener(AgentEventEnum.TOOL_START, onToolStart);
    es.addEventListener(AgentEventEnum.TOOL_END, onToolEnd);
    es.addEventListener(AgentEventEnum.ERROR, onAgentError);

    return () => es.close();
  }, []);
};
