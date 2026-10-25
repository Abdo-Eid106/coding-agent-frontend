import { Api, QueryKeys } from "@/shared";
import { type McpServerDto } from "../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const fetchMcpServers = async () => {
  const { data } = await Api.get<McpServerDto[]>("/mcp-servers");
  return data;
};

const reloadMcpServers = async () => {
  const { data } = await Api.post("/reload-mcp-servers");
  return data;
};

export const useFetchMcpServers = () => {
  return useQuery({ queryKey: [QueryKeys.MCPS], queryFn: fetchMcpServers });
};

export const useReloadMcpServers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reloadMcpServers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.MCPS] });
    },
  });
};
