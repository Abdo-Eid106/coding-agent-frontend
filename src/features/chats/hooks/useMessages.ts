import {
  useMutation,
  useQueryClient,
  QueryClient,
  useQuery,
} from "@tanstack/react-query";
import {
  MessageRole,
  type AddMessageDto,
  type MessageDto,
  type ResumeInterruptDto,
} from "../types";
import {
  type AgentStreamEvent,
  type TokenEvent,
} from "../../../types/agent-stream-event";
import { QueryKeys } from "../../../shared";
import { Api } from "../../../shared/api/axios-instance";
import { useInterruptsStore } from "./useInterruptStore";

const fetchMessages = async (
  sessionId: string,
  cursor?: string,
): Promise<MessageDto[]> => {
  const { data } = await Api.get<MessageDto[]>(
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

const resumeInterrupt = async (dto: ResumeInterruptDto) => {
  const { data } = await Api.post("/resume-interrupt", dto);
  return data;
};

export const useFetchMessages = (sessionId?: string) => {
  return useQuery({
    queryKey: messagesKey(sessionId!),
    queryFn: () => fetchMessages(sessionId!),
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

      const previousData = queryClient.getQueryData<MessageDto[]>(queryKey);

      queryClient.setQueryData<MessageDto[]>(queryKey, (old = []) => {
        const optimisticMessage: MessageDto = {
          id: dto.messageId!,
          content: dto.messageContent,
          role: MessageRole.USER,
          createdAt: new Date().toISOString(),
        };

        return [...old, optimisticMessage];
      });

      return { previousData };
    },
    onError: (_error, _dto, context) => {
      queryClient.setQueryData(queryKey, context?.previousData);
    },
  });
};

export const useResumeInterrupt = () => {
  const removeInterrupt = useInterruptsStore((store) => store.removeInterrupt);

  return useMutation({
    mutationFn: resumeInterrupt,
    onSuccess: (_, { messageId }) => removeInterrupt(messageId),
  });
};

export const addToken = (queryClient: QueryClient, event: TokenEvent) => {
  const {
    context: { sessionId, messageId },
    data: { replyId, token },
  } = event;

  const key = messagesKey(sessionId!);

  queryClient.setQueryData<MessageDto[]>(key, (old) => {
    if (!old) {
      console.warn("[addToken] no cache for key");
      return old;
    }

    const messageIdx = old.findIndex((m) => m.id === messageId);

    if (messageIdx === -1) {
      console.warn("[addToken] messageId not found:", messageId);
      return old;
    }

    const message = old[messageIdx];
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

    const updatedMessages = [...old];
    updatedMessages[messageIdx] = { ...message, replies: updatedReplies };

    return updatedMessages;
  });
};

export const finishMessage = (
  queryClient: QueryClient,
  event: AgentStreamEvent,
) => {
  queryClient.invalidateQueries({
    queryKey: messagesKey(event.context.sessionId!),
  });
};
