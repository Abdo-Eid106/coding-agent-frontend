import type { AddProviderDto, UpdateProviderDto } from "../types";
import { Api, QueryKeys } from "../../../shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ProviderDto } from "../types";

const fetchProviders = async () => {
  const { data } = await Api.get<ProviderDto[]>("/providers");
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

export const useFetchProviders = () => {
  return useQuery({ queryKey: [QueryKeys.PROVIDERS], queryFn: fetchProviders });
};

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

export const useUpdateProvider = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateProviderDto) => updateProvider(id, dto),
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
