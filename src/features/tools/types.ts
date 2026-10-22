export enum ToolCallEnum {
  BASH = "bash",
  EDIT_FILE = "edit_file",
  FETCH = "fetch",
  GLOB = "glob",
  GREP = "grep",
  LS = "ls",
  VIEW = "view",
  WRITE = "write",
}

export interface BashToolCall {
  id: string;
  name: ToolCallEnum.BASH;
  input: {
    command: string;
    cwd?: string;
    timeout?: number;
    maxOutputLength?: number;
    shell?: string;
    env?: Record<string, string>;
  };
  output?: {
    stdout?: string;
    stderr?: string;
    exitCode?: number;
  };
  startedAt?: Date | string | null;
  finishedAt?: Date | string | null;
}

export interface EditFileToolCall {
  id: string;
  name: ToolCallEnum.EDIT_FILE;
  input: {
    filePath: string;
    oldText: string;
    newText: string;
  };
  output?: {
    original: string;
    modified: string;
  };
  startedAt?: Date | string | null;
  finishedAt?: Date | string | null;
}

export interface FetchToolCall {
  id: string;
  name: ToolCallEnum.FETCH;
  input: {
    url: string;
    timeout?: number;
    format?: "text" | "markdown";
  };
  output?: {
    content: string;
  };
  startedAt?: Date | string | null;
  finishedAt?: Date | string | null;
}

export interface GlobToolCall {
  id: string;
  name: ToolCallEnum.GLOB;
  input: {
    directory: string;
    pattern: string;
    limit?: number;
    ignore?: string[];
    maxDepth?: number;
  };
  output?: {
    files: string[];
    total: number;
    truncated: boolean;
  };
  startedAt?: Date | string | null;
  finishedAt?: Date | string | null;
}

export interface GrepToolCall {
  id: string;
  name: ToolCallEnum.GREP;
  input: {
    directory: string;
    pattern: string;
    isRegex?: boolean;
    ignoreCase?: boolean;
    globs?: string[];
  };
  output?: {
    content: string;
  };
  startedAt?: Date | string | null;
  finishedAt?: Date | string | null;
}

export interface LsToolCall {
  id: string;
  name: ToolCallEnum.LS;
  input: {
    directory: string;
    all?: boolean;
    sort?: boolean;
    limit?: number;
    recursive?: boolean;
    maxDepth?: number;
    ignore?: string[];
  };
  output?: {
    name: string;
    type: "directory" | "file";
    size?: number;
    modifiedAt?: string;
  }[];
  startedAt?: Date | string | null;
  finishedAt?: Date | string | null;
}

export interface ViewToolCall {
  id: string;
  name: ToolCallEnum.VIEW;
  input: {
    filePath: string;
    startLine?: number;
    endLine?: number;
  };
  output?: {
    content: string;
  };
  startedAt?: Date | string | null;
  finishedAt?: Date | string | null;
}

export interface WriteToolCall {
  id: string;
  name: ToolCallEnum.WRITE;
  input: {
    filePath: string;
    content: string;
    overwrite?: boolean;
  };
  output?: {
    content: string;
  };
  startedAt?: Date | string | null;
  finishedAt?: Date | string | null;
}

/**
 * Discriminated union of all tool calls.
 * Switching on `toolCall.name` automatically narrows `input` and `output`.
 */
export type ToolCallDto =
  | BashToolCall
  | EditFileToolCall
  | FetchToolCall
  | GlobToolCall
  | GrepToolCall
  | LsToolCall
  | ViewToolCall
  | WriteToolCall;
