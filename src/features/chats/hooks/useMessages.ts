import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import {
  MessageRole,
  type AddMessageDto,
  type GetMessagesResponseDto,
} from "../types";
import {
  type AgentStreamEvent,
  type AgentErrorEvent,
  AgentEventEnum,
  type TokenEvent,
  type ToolCallEvent,
} from "../../../types/agent-stream-event";
import type { ToolCallDto } from "../../tools/types";
import { QueryKeys } from "../../../shared";
import { Api } from "../../../shared/api/axios-instance";
import { toast } from "sonner";
import { useChatStore } from "./useChatStore";

const fetchMessages = async (
  sessionId: string,
  cursor?: string,
): Promise<GetMessagesResponseDto> => {
  const { data } = await Api.get<GetMessagesResponseDto>(
    `sessions/${sessionId}/messages`,
    { params: { cursor } },
  );

  alert(typeof data.items?.[0].toolCalls?.[1]?.input);
  return data;
};

const messagesKey = (sessionId: string) => [
  QueryKeys.SESSIONS,
  sessionId,
  QueryKeys.MESSAGES,
];

const addMessage = async (
  sessionId: string,
  dto: AddMessageDto,
): Promise<unknown> => {
  const { data } = await Api.post(`sessions/${sessionId}/messages`, dto);
  return data;
};

export const useFetchMessages = (sessionId?: string) => {
  return useInfiniteQuery({
    queryKey: messagesKey(sessionId!),
    queryFn: ({ pageParam }) => fetchMessages(sessionId!, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!sessionId,
  });
};

export const useAddMessage = (sessionId: string) => {
  const queryClient = useQueryClient();
  const queryKey = messagesKey(sessionId);

  return useMutation({
    mutationFn: (dto: AddMessageDto) => addMessage(sessionId, dto),
    onMutate: async (dto) => {
      await queryClient.cancelQueries({ queryKey });

      const previousData =
        queryClient.getQueryData<
          InfiniteData<GetMessagesResponseDto, string | undefined>
        >(queryKey);

      queryClient.setQueryData<
        InfiniteData<GetMessagesResponseDto, string | undefined>
      >(queryKey, (old) => {
        if (!old || old.pages.length === 0) return old;

        const optimisticMessage = {
          id: dto.messageId!,
          content: dto.messageContent,
          role: MessageRole.USER,
          createdAt: new Date().toISOString(),
        };

        const pages = [...old.pages];
        const lastPageIndex = pages.length - 1;
        const lastPage = pages[lastPageIndex];

        pages[lastPageIndex] = {
          ...lastPage,
          items: [...lastPage.items, optimisticMessage],
        };

        return { ...old, pages };
      });

      return { previousData };
    },
    onError: (_error, _dto, context) => {
      useChatStore.getState().setIsAgentRunning(false);
      queryClient.setQueryData(queryKey, context?.previousData);
    },
  });
};

type Handler<T> = (queryClient: QueryClient, event: T) => void;

const addToken: Handler<AgentStreamEvent> = (queryClient, event) => {
  useChatStore.getState().setIsAgentRunning(true);
  const { sessionId, messageId, payload } = event as TokenEvent;
  const { replyId, token } = payload;

  queryClient.setQueryData<
    InfiniteData<GetMessagesResponseDto, string | undefined>
  >(messagesKey(sessionId), (old) => {
    if (!old) return old;

    let found = false;

    const pages = old.pages.map((page) => ({
      ...page,
      items: page.items.map((message) => {
        if (message.id !== messageId) return message;
        found = true;

        const replies = message.replies ?? [];
        const index = replies.findIndex((r) => r.id === replyId);

        const nextReplies =
          index === -1
            ? [
                ...replies,
                {
                  id: replyId,
                  content: token,
                  role: "ai" as const,
                  createdAt: new Date().toISOString(),
                  parentMessage: messageId,
                },
              ]
            : replies.map((r, i) =>
                i === index ? { ...r, content: r.content + token } : r,
              );

        return { ...message, replies: nextReplies };
      }),
    }));

    return found ? { ...old, pages } : old;
  });
};

const finishMessage: Handler<AgentStreamEvent> = (queryClient, event) => {
  useChatStore.getState().setIsAgentRunning(false);
  queryClient.invalidateQueries({ queryKey: messagesKey(event.sessionId) });
};

const handleInterrupt: Handler<AgentStreamEvent> = (_queryClient, event) => {
  useChatStore.getState().setIsAgentRunning(false);
  console.log("interrupt", event.payload);
};

const handleToolStart: Handler<AgentStreamEvent> = (queryClient, event) => {
  useChatStore.getState().setIsAgentRunning(true);
  const { sessionId, messageId, payload } = event as ToolCallEvent;
  const { id, name, input } = payload;

  queryClient.setQueryData<
    InfiniteData<GetMessagesResponseDto, string | undefined>
  >(messagesKey(sessionId), (old) => {
    if (!old) return old;

    let found = false;

    const pages = old.pages.map((page) => ({
      ...page,
      items: page.items.map((message) => {
        if (message.id !== messageId) return message;
        found = true;

        const toolCalls = message.toolCalls ?? [];
        const index = toolCalls.findIndex((t) => t.id === id);

        const newToolCall = {
          id,
          name: name as ToolCallDto["name"],
          input: (input ?? {}) as any,
          output: undefined,
        } as ToolCallDto;

        const nextToolCalls =
          index === -1
            ? [...toolCalls, newToolCall]
            : toolCalls.map((t, i) =>
                i === index
                  ? ({
                      ...t,
                      name: name as ToolCallDto["name"],
                      input: (input ?? t.input) as any,
                    } as ToolCallDto)
                  : t,
              );

        return { ...message, toolCalls: nextToolCalls };
      }),
    }));

    return found ? { ...old, pages } : old;
  });
};

const handleToolEnd: Handler<AgentStreamEvent> = (queryClient, event) => {
  const { sessionId, messageId, payload } = event as ToolCallEvent;
  const { id, output } = payload;

  queryClient.setQueryData<
    InfiniteData<GetMessagesResponseDto, string | undefined>
  >(messagesKey(sessionId), (old) => {
    if (!old) return old;

    let found = false;

    const pages = old.pages.map((page) => ({
      ...page,
      items: page.items.map((message) => {
        if (message.id !== messageId) return message;
        found = true;

        const toolCalls = message.toolCalls ?? [];
        const nextToolCalls = toolCalls.map((t) =>
          t.id === id ? ({ ...t, output: output as any } as ToolCallDto) : t,
        );

        return { ...message, toolCalls: nextToolCalls };
      }),
    }));

    return found ? { ...old, pages } : old;
  });
};

export const agentHandlers = {
  [AgentEventEnum.TOKEN]: addToken,
  [AgentEventEnum.DONE]: finishMessage,
  [AgentEventEnum.INTERRUPT]: handleInterrupt,
  [AgentEventEnum.TOOL_START]: handleToolStart,
  [AgentEventEnum.TOOL_END]: handleToolEnd,
};

export const handleAgentError = (event: AgentErrorEvent) => {
  useChatStore.getState().setIsAgentRunning(false);
  toast.error(event.error);
};
