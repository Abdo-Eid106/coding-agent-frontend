import type { AddCustomProviderDto } from "../types";
import { Api, QueryKeys } from "../../../shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AddApiKeyDto, ProviderDto } from "../types";

const fetchProviders = async () => {
  const { data } = await Api.get<ProviderDto[]>("/providers");
  return data;
};

const fetchConfiguredProviders = async (): Promise<ProviderDto[]> => {
  const { data } = await Api.get<ProviderDto[]>("/providers/configured");
  return data;
};

const addCustomProvider = async (dto: AddCustomProviderDto): Promise<void> => {
  await Api.post("/providers", dto);
};

const deleteCustomProvider = async (providerId: string): Promise<void> => {
  await Api.delete(`/providers/${providerId}`);
};

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

export const useFetchProviders = () => {
  return useQuery({ queryKey: [QueryKeys.PROVIDERS], queryFn: fetchProviders });
};

export const useFetchConfiguredProviders = () =>
  useQuery({
    queryKey: [QueryKeys.PROVIDERS, "configured"],
    queryFn: fetchConfiguredProviders,
  });

export const useAddCustomProvider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addCustomProvider,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.PROVIDERS],
      });
    },
  });
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

export const useDeleteCustomProvider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCustomProvider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PROVIDERS] });
    },
  });
};
