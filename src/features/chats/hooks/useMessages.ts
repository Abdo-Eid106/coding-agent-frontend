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
  type TokenEvent,
} from "../../../types/agent-stream-event";
import { QueryKeys } from "../../../shared";
import { Api } from "../../../shared/api/axios-instance";

const fetchMessages = async (
  sessionId: string,
  cursor?: string,
): Promise<GetMessagesResponseDto> => {
  const { data } = await Api.get<GetMessagesResponseDto>(
    `sessions/${sessionId}/messages`,
    { params: { cursor } },
  );
  return data;
};

export const messagesKey = (sessionId: string) => [
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
    getPreviousPageParam: (firstPage) => firstPage.nextCursor ?? undefined,
    getNextPageParam: (_) => undefined,
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
      queryClient.setQueryData(queryKey, context?.previousData);
    },
  });
};

export const addToken = (queryClient: QueryClient, event: TokenEvent) => {
  const { sessionId, messageId, payload } = event;
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

export const finishMessage = (
  queryClient: QueryClient,
  event: AgentStreamEvent,
) => {
  queryClient.invalidateQueries({ queryKey: messagesKey(event.sessionId) });
};
