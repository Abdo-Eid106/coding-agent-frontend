import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api, QueryKeys } from "../../../shared";
import type {
  AddProjectDto,
  AddProjectResponseDto,
  ProjectDto,
} from "../types";

export const fetchProjects = async (): Promise<ProjectDto[]> => {
  const { data } = await Api.get<ProjectDto[]>("/projects");
  return data;
};

const createProject = async (
  addProjectDto: AddProjectDto,
): Promise<AddProjectResponseDto> => {
  const { data } = await Api.post<AddProjectResponseDto>(
    "/projects",
    addProjectDto,
  );
  return data;
};

const deleteProject = async (id: string): Promise<void> => {
  const { data } = await Api.delete(`/projects/${id}`);
  return data;
};

export const useFetchProjects = () =>
  useQuery({
    queryKey: [QueryKeys.PROJECTS],
    queryFn: fetchProjects,
  });

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PROJECTS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SESSIONS] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PROJECTS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SESSIONS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.MESSAGES] });
    },
  });
};
