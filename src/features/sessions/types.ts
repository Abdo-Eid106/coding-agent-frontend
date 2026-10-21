import { type ProjectDto } from "../projects/types";

export interface SessionDto {
  id: string;
  title: string | null;
  project?: ProjectDto | null;
}

export interface CreateSessionDto {
  messageContent: string;
  modelId: string;
  projectId?: string;
}

export interface CreateSessionResponse extends SessionDto {}
