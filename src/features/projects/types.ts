import { type SessionDto } from "../sessions/types";

export interface ProjectDto {
  id: string;
  name: string;
  path: string;
  sessions?: SessionDto[];
}

export interface AddProjectDto {
  directory: string;
}

export interface AddProjectResponseDto {
  message: string;
}
