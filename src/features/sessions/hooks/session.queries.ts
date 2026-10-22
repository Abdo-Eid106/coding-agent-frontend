import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreateSessionDto,
  SessionDto,
  CreateSessionResponse,
  GetSessionsResponse,
} from "../types";
import { QueryKeys } from "../../../shared";
import { Api } from "../../../shared";

const fetchSessions = async (): Promise<GetSessionsResponse> => {
  const { data } = await Api.get<GetSessionsResponse>("/sessions");
  return data;
};

const fetchSession = async (id: string): Promise<SessionDto> => {
  const { data } = await Api.get<SessionDto>(`/sessions/${id}`);
  return data;
};

const fetchActiveSessions = async () => {
  const { data } = await Api.get<string[]>("/sessions");
  return data;
};

const createSession = async (
  createSessionDto: CreateSessionDto,
): Promise<CreateSessionResponse> => {
  const { data } = await Api.post("/sessions", createSessionDto);
  return data;
};

const deleteSession = async (id: string): Promise<void> => {
  const { data } = await Api.delete(`/sessions/${id}`);
  return data;
};

export const useFetchSessions = () =>
  useQuery({
    queryKey: [QueryKeys.SESSIONS],
    queryFn: fetchSessions,
  });

const activeSessionsKey = [QueryKeys.SESSIONS, "active"] as const;

export const useFetchActiveSessions = () =>
  useQuery({
    queryKey: activeSessionsKey,
    queryFn: fetchActiveSessions,
  });

export const useFetchSession = (id?: string) =>
  useQuery({
    queryKey: [QueryKeys.SESSIONS, id],
    queryFn: () => fetchSession(id!),
    enabled: !!id,
  });

export const useCreateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SESSIONS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PROJECTS] });
    },
  });
};

export const useDeleteSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SESSIONS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PROJECTS] });
    },
  });
};

export const useActiveSessions = () => {
  const queryClient = useQueryClient();

  const addActiveSession = (id: string) =>
    queryClient.setQueryData<string[]>(activeSessionsKey, (old = []) =>
      old.includes(id) ? old : [...old, id],
    );

  const removeActiveSession = (id: string) =>
    queryClient.setQueryData<string[]>(activeSessionsKey, (old = []) =>
      old.filter((sessionId) => sessionId !== id),
    );

  return { addActiveSession, removeActiveSession };
};
