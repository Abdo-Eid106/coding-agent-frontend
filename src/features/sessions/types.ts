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

export interface GetSessionsResponse {
  projects: ProjectDto[];
  sessions: SessionDto[];
}

export enum SessionStatus {
  RUNNING = "running",
  IDLE = "idle",
}

export interface SessionEvent {
  sessionId: string;
  status: SessionStatus;
}
