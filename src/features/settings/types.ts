export enum SettingsTab {
  PROVIDERS = "providers",
  MODELS = "models",
  GENERAL = "general",
  APPEARANCE = "appearance",
}

export enum CommandApprovalMode {
  ALWAYS_ASK = "always_ask",
  ASK_UNLESS_ALLOWLISTED = "ask_unless_allowlisted",
  NEVER_ASK = "never_ask",
}

export interface AgentSettingsDto {
  id: string;
  commandApprovalMode: CommandApprovalMode;
  updatedAt: Date;
}

export interface UpdateAgentSettingsDto {
  commandApprovalMode: CommandApprovalMode;
}
