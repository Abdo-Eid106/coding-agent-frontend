export interface ToolCall {
  id: string;
  type: string;
  input?: unknown;
  output: string;
  tool?: string;
  summary?: string;
  filePath?: string;
  diff?: string;
  status?: "success" | "error";
  duration?: string;
}

export interface ConversationTurn {
  id: string;
  userMessage: string;
  aiMessage: string;
  toolCalls?: ToolCall[];
  aiResponse?: string;
  timestamp?: string;
  sessionId?: string;
}

export interface Session {
  id: string;
  title: string;
  turns: ConversationTurn[];
  name?: string;
  lastActive?: string;
}

export interface Project {
  id: string;
  name: string;
  workingDirectory: string;
  sessions: Session[];
  isExpanded?: boolean;
}
