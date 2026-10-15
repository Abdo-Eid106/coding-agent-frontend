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

export enum MessageRole {
  USER = "user",
  AI = "ai",
}

export interface MessageDto {
  id: string;
  content: string;
  role: MessageRole | "user" | "ai";
  createdAt: string;
  session?: { id: string };
}

export interface GetMessagesQueryDto {
  cursor?: string;
  limit?: number | string;
}

export interface GetMessagesResponseDto {
  items: MessageDto[];
}

export interface AddMessageDto {
  messageContent: string;
  modelId: string;
  sessionId?: string;
}

export type AgentEvent =
  | { type: "token"; content: string }
  | { type: "interrupt"; payload: unknown }
  | { type: "done" };

export interface AddApiKeyDto {
  apiKey: string;
}

export interface ModelDto {
  id: string;
  name: string;
  apiModel: string;
  contextWindow: number;
  defaultMaxTokens: number;
  supportsAttachments: boolean;
  provider: string;
}

export interface ConfiguredProviderDto {
  id: string;
  name: string;
  apiKey: string | null;
  baseUrl: string | null;
  models: ModelDto[];
}
