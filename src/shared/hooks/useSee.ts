import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  type TokenEvent,
  type AgentStreamEvent,
  AgentEventEnum,
  type ErrorEvent,
  type SessionEvent,
  type ToolCallEvent,
  type InterruptEvent,
} from "../../types/agent-stream-event";

import {
  addToken,
  finishMessage,
} from "../../features/chats/hooks/useMessages";

import { SessionStatus } from "@/features/sessions/types";
import { useActiveSessions } from "../../features/sessions/hooks/session.queries";
import { addToolCall } from "../../features/tools/helpers/addToolCall";
import { useInterruptsStore } from "@/features/chats/hooks/useInterruptStore";

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
  const addInterrupt = useInterruptsStore((store) => store.addInterrupt);

  useEffect(() => {
    const es = new EventSource(`${API_URL}/events`);

    const onToken = (e: Event) =>
      handleEvent<TokenEvent>(e, (event) => addToken(queryClient, event));

    const onDone = (e: Event) =>
      handleEvent<AgentStreamEvent>(e, (event) =>
        finishMessage(queryClient, event),
      );

    const onAgentError = (e: Event) =>
      handleEvent<ErrorEvent>(e, (event) => toast.error(event.data.message));

    const onToolStart = (e: Event) =>
      handleEvent<ToolCallEvent>(e, (event) => addToolCall(queryClient, event));

    const onToolEnd = (e: Event) =>
      handleEvent<ToolCallEvent>(e, (event) => addToolCall(queryClient, event));

    const onToolError = (e: Event) =>
      handleEvent<ToolCallEvent>(e, (event) => addToolCall(queryClient, event));

    const onSessionStatus = (e: Event) =>
      handleEvent<SessionEvent>(e, (event) => {
        if (event.data.status === SessionStatus.RUNNING) {
          addActiveSession(event.context.sessionId!);
        } else {
          removeActiveSession(event.context.sessionId!);
        }
      });

    const onInterrupt = (e: Event) =>
      handleEvent<InterruptEvent>(e, (event) => {
        addInterrupt(event.context.messageId!, event.data);
      });

    es.addEventListener(AgentEventEnum.TOKEN, onToken);
    es.addEventListener(AgentEventEnum.DONE, onDone);
    es.addEventListener(AgentEventEnum.SESSION_STATUS, onSessionStatus);
    es.addEventListener(AgentEventEnum.TOOL_START, onToolStart);
    es.addEventListener(AgentEventEnum.TOOL_END, onToolEnd);
    es.addEventListener(AgentEventEnum.TOOL_ERROR, onToolError);
    es.addEventListener(AgentEventEnum.ERROR, onAgentError);
    es.addEventListener(AgentEventEnum.INTERRUPT, onInterrupt);

    return () => es.close();
  }, []);
};
