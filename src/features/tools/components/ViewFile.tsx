import hljs from "highlight.js";
import { FileText, Loader2 } from "lucide-react";
import { formatToolDuration } from "../lib/duration";
import CopyButton from "./CopyButton";
import ToolCallItem from "./ToolCalItem";

export interface ViewFileToolCallProps {
  filePath: string;
  content?: string;
  startedAt?: Date | string | null;
  finishedAt?: Date | string | null;
}

export type ViewileToolCallProps = ViewFileToolCallProps;

export function ViewFileToolCall({
  filePath,
  content,
  startedAt,
  finishedAt,
}: ViewFileToolCallProps) {
  const isLoading = content === undefined;
  const duration = formatToolDuration(startedAt, finishedAt);

  const lineCount =
    content === undefined || content === ""
      ? 0
      : content.split("\n").filter((text) => text.length > 0).length;

  // Unknown extensions fall back to "plaintext", which hljs still HTML-escapes.
  const extension = filePath.split(".").pop() ?? "";
  const language = hljs.getLanguage(extension) ? extension : "plaintext";
  const html = !isLoading
    ? hljs.highlight(content, {
        language,
        ignoreIllegals: true,
      }).value
    : "";

  const header = (
    <div className="flex min-w-0 items-center gap-2 w-full">
      <FileText
        className="size-3.5 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <span className="shrink-0 text-muted-foreground">View</span>
      <span className="truncate font-mono min-w-0 flex-1">{filePath}</span>
      <div className="ml-auto flex shrink-0 items-center gap-2 font-mono text-[11px] text-muted-foreground">
        {duration && <span>{duration}</span>}
        {isLoading ? (
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
            <Loader2 className="size-3 animate-spin" />
            <span className="hidden sm:inline">Reading...</span>
          </span>
        ) : (
          <span>
            {lineCount} {lineCount === 1 ? "line" : "lines"}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <ToolCallItem header={header}>
      {isLoading ? (
        <div className="flex items-center gap-2 py-2 text-xs text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" />
          <span>Reading file...</span>
        </div>
      ) : (
        <div className="flex items-start gap-2 py-1 min-w-0">
          <pre className="max-h-96 min-w-0 flex-1 overflow-auto whitespace-pre-wrap wrap-anywhere font-mono text-xs">
            <code className="hljs" dangerouslySetInnerHTML={{ __html: html }} />
          </pre>
          {content && (
            <CopyButton
              text={content}
              label="file content"
              className="shrink-0"
            />
          )}
        </div>
      )}
    </ToolCallItem>
  );
}
