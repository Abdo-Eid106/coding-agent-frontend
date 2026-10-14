import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AddMessageDto,
  GetMessagesQueryDto,
  GetMessagesResponseDto,
} from "./types";
import { QueryKeys } from "../shared";
import { Api } from "../shared/api/axios-instance";

const fetchMessages = async (
  sessionId: string,
  params?: GetMessagesQueryDto
): Promise<GetMessagesResponseDto> => {
  const { data } = await Api.get<GetMessagesResponseDto>(
    `/messages/${sessionId}`,
    { params }
  );
  return data;
};

const addMessage = async (dto: AddMessageDto): Promise<unknown> => {
  const { sessionId, ...body } = dto;
  const url = sessionId ? `/messages/${sessionId}` : "/messages";
  const { data } = await Api.post(url, body);
  return data;
};

export const useFetchMessages = (
  sessionId?: string,
  params?: GetMessagesQueryDto
) =>
  useQuery({
    queryKey: [QueryKeys.MESSAGES, sessionId, params],
    queryFn: () => fetchMessages(sessionId!, params),
    enabled: !!sessionId,
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
    },
  });
};
