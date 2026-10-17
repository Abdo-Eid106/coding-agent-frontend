import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import {
  MessageRole,
  type AddMessageDto,
  type GetMessagesResponseDto,
} from "./types";
import { QueryKeys } from "../shared";
import { Api } from "../shared/api/axios-instance";

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
      queryClient.setQueryData(queryKey, context?.previousData);
    },
  });
};
