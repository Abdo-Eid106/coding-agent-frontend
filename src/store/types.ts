export interface Session {
  id: string;
  name: string;
  lastActive: string; // relative time like "5d", "8h", "14d"
}

export interface Project {
  id: string;
  name: string;
  workingDirectory: string;
  sessions: Session[];
  isExpanded: boolean;
}

export interface ToolCall {
  id: string;
  tool: string;
  summary?: string;
  filePath?: string;
  output: string;
  diff?: string;
  status?: "success" | "error";
  duration?: string;
}

export interface ConversationTurn {
  id: string;
  userMessage: string;
  toolCalls?: ToolCall[];
  aiResponse: string;
  timestamp?: string;
}
