import type { ToolCallEvent } from "../../../types/agent-stream-event";
import { QueryClient } from "@tanstack/react-query";
import type { MessageDto } from "../../chats/types";
import { messagesKey } from "../../chats/hooks/useMessages";
import type { ToolCallDto } from "../types";

function upsertToolCall(
  toolCalls: ToolCallDto[] = [],
  incoming: ToolCallEvent["payload"],
): ToolCallDto[] {
  const index = toolCalls.findIndex((t) => t.id === incoming.id);

  if (index === -1) {
    const newToolCall = {
      id: incoming.id,
      name: incoming.name as ToolCallDto["name"],
      input: (incoming.input ?? {}) as ToolCallDto["input"],
      output: incoming.output as ToolCallDto["output"],
      startedAt: incoming.startedAt,
    } as ToolCallDto;

    return [...toolCalls, newToolCall];
  }

  return toolCalls.map((t, i) =>
    i === index
      ? ({
          ...t,
          ...(incoming.output && {
            output: incoming.output as ToolCallDto["output"],
            finishedAt: incoming.finishedAt,
          }),
        } as ToolCallDto)
      : t,
  );
}

export const addToolCall = (queryClient: QueryClient, event: ToolCallEvent) => {
  const { sessionId, messageId, payload: toolCall } = event;

  queryClient.setQueryData<MessageDto[]>(messagesKey(sessionId), (messages) => {
    if (!messages) return messages;

    let found = false;

    const updatedMessages = messages.map((message) => {
      if (message.id !== messageId) return message;

      found = true;

      return {
        ...message,
        toolCalls: upsertToolCall(message.toolCalls, toolCall),
      };
    });

    return found ? updatedMessages : messages;
  });
};
