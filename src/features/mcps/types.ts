export interface McpToolDto {
  name: string;
  displayName: string;
  description: string;
}

export interface McpServerDto {
  name: string;
  status: "connected" | "failed";
  tools: McpToolDto[];
}
