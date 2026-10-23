import type { AddProviderDto, UpdateProviderDto } from "../types";
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

const addProvider = async (dto: AddProviderDto): Promise<void> => {
  await Api.post("/providers", dto);
};

const updateProvider = async (id: string, dto: UpdateProviderDto) => {
  await Api.put(`/providers/${id}`, dto);
};

const deleteProvider = async (providerId: string): Promise<void> => {
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

export const useAddProvider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addProvider,
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

export const useUpdateProvider = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateProviderDto) => updateProvider(id, dto),
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

export const useDeleteProvider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProvider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PROVIDERS] });
    },
  });
};
