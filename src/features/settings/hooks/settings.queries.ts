import { Api, QueryKeys } from "@/shared";
import { type AgentSettingsDto, type UpdateAgentSettingsDto } from "../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const fetchSettings = async () => {
  const { data } = await Api.get<AgentSettingsDto>("/settings");
  return data;
};

const updateSettings = async (dto: UpdateAgentSettingsDto) => {
  const { data } = await Api.put("/settings", dto);
  return data;
};

export const useFetchSettings = () => {
  return useQuery({ queryKey: [QueryKeys.SETTINGS], queryFn: fetchSettings });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SETTINGS] });
    },
  });
};
