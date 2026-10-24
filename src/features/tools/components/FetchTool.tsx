import ReactMarkdown, { type Components } from "react-markdown";
import { Globe, Loader2 } from "lucide-react";

import { formatToolDuration } from "../lib/duration";
import ToolCallItem from "./ToolCalItem";

export interface FetchToolProps {
  url: string;
  content?: string;
  format?: "text" | "markdown";
  startedAt?: Date | string | null;
  finishedAt?: Date | string | null;
}

const markdownComponents: Components = {
  a: ({ node: _node, ...props }) => (
    <a {...props} target="_blank" rel="noopener noreferrer" />
  ),
};

export function FetchTool({
  url,
  content,
  format = "text",
  startedAt,
  finishedAt,
}: FetchToolProps) {
  const isLoading = content === undefined;
  const isEmpty = !isLoading && content.trim() === "";
  const duration = formatToolDuration(startedAt, finishedAt);

  const header = (
    <div className="flex w-full min-w-0 items-center gap-2 text-xs">
      <Globe
        className="size-3.5 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <span className="shrink-0 text-muted-foreground">Fetched</span>
      <span className="min-w-0 flex-1 truncate font-mono">{url}</span>
      <div className="ml-auto flex shrink-0 items-center gap-2 font-mono text-muted-foreground">
        {duration && <span>{duration}</span>}
        {isLoading ? (
          <span className="flex items-center gap-1.5">
            <Loader2 className="size-3.5 animate-spin" />
            <span className="hidden sm:inline">Fetching...</span>
          </span>
        ) : (
          <span>{content.length.toLocaleString()} chars</span>
        )}
      </div>
    </div>
  );

  return (
    <ToolCallItem header={header}>
      {isLoading ? (
        <div className="flex items-center gap-2 py-3 text-xs text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" />
          <span>Fetching content...</span>
        </div>
      ) : isEmpty ? (
        <p className="py-1 text-xs italic text-muted-foreground">
          Empty response
        </p>
      ) : format === "markdown" ? (
        <div className="prose prose-sm dark:prose-invert max-h-96 max-w-none min-w-0 overflow-auto py-1 text-xs wrap-anywhere">
          <ReactMarkdown components={markdownComponents}>
            {content}
          </ReactMarkdown>
        </div>
      ) : (
        <pre className="max-h-96 min-w-0 overflow-auto whitespace-pre-wrap py-1 font-mono text-xs text-foreground/85 wrap-anywhere">
          {content}
        </pre>
      )}
    </ToolCallItem>
  );
}
