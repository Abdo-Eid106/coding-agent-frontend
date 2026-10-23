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
  const {
    sessionId,
    messageId,
    payload: { replyId, token },
  } = event;

  const key = messagesKey(sessionId);

  console.log(
    "[addToken] key:",
    key,
    "cache exists:",
    !!queryClient.getQueryData(key),
  );

  queryClient.setQueryData<
    InfiniteData<GetMessagesResponseDto, string | undefined>
  >(key, (old) => {
    if (!old) {
      console.warn("[addToken] no cache for key");
      return old;
    }

    const pageIdx = old.pages.findIndex((page) =>
      page.items.some((message) => message.id === messageId),
    );

    if (pageIdx === -1) {
      console.warn("[addToken] messageId not found:", messageId);
      return old;
    }

    const page = old.pages[pageIdx];
    const messageIdx = page.items.findIndex((m) => m.id === messageId);
    const message = page.items[messageIdx];
    const replies = message.replies ?? [];
    const lastReply = replies.at(-1);

    const updatedReplies =
      lastReply?.id === replyId
        ? [
            ...replies.slice(0, -1),
            { ...lastReply, content: lastReply.content + token },
          ]
        : [
            ...replies,
            {
              id: replyId,
              content: token,
              role: MessageRole.AI,
              createdAt: new Date().toISOString(),
              parentMessage: messageId,
            },
          ];

    const items = page.items.map((item, idx) =>
      idx === messageIdx ? { ...item, replies: updatedReplies } : item,
    );

    const pages = old.pages.slice();
    pages[pageIdx] = { ...page, items };

    return { ...old, pages };
  });
};

export const finishMessage = (
  queryClient: QueryClient,
  event: AgentStreamEvent,
) => {
  queryClient.invalidateQueries({ queryKey: messagesKey(event.sessionId) });
};
