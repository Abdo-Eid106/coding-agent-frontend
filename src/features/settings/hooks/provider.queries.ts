import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AddApiKeyDto } from "../types";
import { Api, QueryKeys } from "../../../shared";

const addProviderApiKey = async ({
  providerId,
  apiKey,
}: {
  providerId: string;
  apiKey: string;
}): Promise<unknown> => {
  const body: AddApiKeyDto = { apiKey };
  const { data } = await Api.post(`/providers/${providerId}/api-key`, body);
  return data;
};

const removeProviderApiKey = async (providerId: string): Promise<void> => {
  await Api.delete(`/providers/${providerId}/api-key`);
};

export const useAddProviderApiKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addProviderApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PROVIDERS] });
    },
  });
};

export const useRemoveProviderApiKey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (providerId: string) => removeProviderApiKey(providerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PROVIDERS] });
    },
  });
};
