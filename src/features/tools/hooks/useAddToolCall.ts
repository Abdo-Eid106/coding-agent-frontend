import type { ToolCallEvent } from "../../../types/agent-stream-event";
import {
  QueryClient,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import type { GetMessagesResponseDto } from "../../chats/types";
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

  queryClient.setQueryData<
    InfiniteData<GetMessagesResponseDto, string | undefined>
  >(messagesKey(sessionId), (old) => {
    if (!old) return old;

    let found = false;

    const pages = old.pages.map((page) => {
      const hasTargetMessage = page.items.some((msg) => msg.id === messageId);
      if (!hasTargetMessage) return page;

      found = true;

      return {
        ...page,
        items: page.items.map((message) => {
          if (message.id !== messageId) return message;

          return {
            ...message,
            toolCalls: upsertToolCall(message.toolCalls, toolCall),
          };
        }),
      };
    });

    return found ? { ...old, pages } : old;
  });
};

export const useAddToolCall = () => {
  const queryClient = useQueryClient();
  return (event: ToolCallEvent) => addToolCall(queryClient, event);
};
