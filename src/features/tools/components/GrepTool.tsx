import { Search, Loader2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatToolDuration } from "../lib/duration";
import ToolCallItem from "./ToolCalItem";
import ToolErrorDisplay from "./ToolErrorDisplay";

export interface GrepToolCallProps {
  pattern: string;
  directory: string;
  /** Plain ripgrep output: one `path:line:text` per line. */
  content?: string;
  startedAt?: Date | string | null;
  finishedAt?: Date | string | null;
  error?: { message?: string } | null;
}

export function GrepTool({
  pattern,
  directory,
  content,
  startedAt,
  finishedAt,
  error,
}: GrepToolCallProps) {
  const isError = Boolean(error);
  const isLoading = !isError && !content;
  const duration = formatToolDuration(startedAt, finishedAt);

  // Paths come back absolute; strip the searched directory to keep lines short.
  const text = !isLoading && !isError && content ? content.replaceAll(`${directory}/`, "").trim() : "";
  const matchCount = !isLoading && !isError && text !== "" ? text.split("\n").length : 0;

  const header = (
    <div className="flex min-w-0 items-center gap-2 w-full">
      <Search
        className="size-3.5 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <span className="shrink-0 text-muted-foreground">Grep</span>
      <span className="truncate font-mono min-w-0 flex-1">{pattern}</span>
      <div className="ml-auto flex shrink-0 items-center gap-2 font-mono text-[11px] text-muted-foreground">
        {duration && <span>{duration}</span>}
        {isLoading ? (
          <span className="flex items-center gap-1.5">
            <Loader2 className="size-3 animate-spin" />
            <span className="hidden sm:inline">Searching...</span>
          </span>
        ) : isError ? (
          <Badge variant="destructive" className="gap-1 font-normal text-[11px] h-5 py-0 px-1.5">
            <AlertCircle className="size-3 shrink-0" />
            Failed
          </Badge>
        ) : (
          <span>
            {matchCount} {matchCount === 1 ? "match" : "matches"}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <ToolCallItem defaultOpen={isError} header={header}>
      {isError && <ToolErrorDisplay error={error} />}
      {isLoading ? (
        <div className="flex items-center gap-2 py-2 text-xs text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" />
          <span>Searching matches...</span>
        </div>
      ) : !isError && (
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap wrap-anywhere font-mono text-xs py-1 min-w-0 text-foreground/85">
          {text || (
            <span className="italic text-muted-foreground">
              No matches found
            </span>
          )}
        </pre>
      )}
    </ToolCallItem>
  );
}
