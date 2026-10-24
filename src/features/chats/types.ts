import type { ToolCallDto } from "../tools/types";

export enum MessageRole {
  USER = "user",
  AI = "ai",
}

export interface MessageDto {
  id: string;
  content: string;
  role: MessageRole | "user" | "ai";
  createdAt: string;
  session?: { id: string } | string;
  parentMessage?: string | null;
  replies?: MessageDto[];
  toolCalls?: ToolCallDto[];
}

export interface GetMessagesQueryDto {
  cursor?: string;
  limit?: number | string;
}

export interface GetMessagesResponseDto {
  items: MessageDto[];
  nextCursor?: string;
}

export interface AddMessageDto {
  messageId?: string;
  messageContent: string;
  modelId: string;
}

export interface ResumeInterruptDto {
  interruptId: string;
  messageId: string;
  payload: { selectedId: string };
}

export interface Interrupt {
  interruptId: string;
  payload: {
    message: string;
    options: { id: string; label: string }[];
  };
}
