import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { AddMessageDto, GetMessagesResponseDto } from "./types";
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

const addMessage = async (dto: AddMessageDto): Promise<unknown> => {
  const { sessionId, ...body } = dto;
  const url = sessionId ? `sessions/${sessionId}/messages` : "/sessions";
  const { data } = await Api.post(url, body);
  return data;
};

export const useFetchMessages = (sessionId?: string) =>
  useInfiniteQuery({
    queryKey: [QueryKeys.MESSAGES, sessionId],
    queryFn: ({ pageParam }) => fetchMessages(sessionId!, pageParam),
    enabled: !!sessionId,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
  });

export const useAddMessage = (sessionId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addMessage,
    onSuccess: (_data, variables) => {
      const targetSessionId = variables.sessionId || sessionId;
      if (targetSessionId) {
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.MESSAGES, targetSessionId],
        });
      }
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SESSIONS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PROJECTS] });
    },
  });
};
