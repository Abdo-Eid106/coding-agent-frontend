import { Search, Loader2 } from "lucide-react";
import AccordionItem from "./AccordionItem";
import { formatToolDuration } from "../lib/duration";

export interface GrepToolCallProps {
  pattern: string;
  directory: string;
  /** Plain ripgrep output: one `path:line:text` per line. */
  content?: string;
  startedAt?: Date | string | null;
  finishedAt?: Date | string | null;
}

export function GrepTool({
  pattern,
  directory,
  content,
  startedAt,
  finishedAt,
}: GrepToolCallProps) {
  const isLoading = !content;
  const duration = formatToolDuration(startedAt, finishedAt);

  // Paths come back absolute; strip the searched directory to keep lines short.
  const text = !isLoading ? content.replaceAll(`${directory}/`, "").trim() : "";
  const matchCount = !isLoading && text !== "" ? text.split("\n").length : 0;

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
        ) : (
          <span>
            {matchCount} {matchCount === 1 ? "match" : "matches"}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <AccordionItem header={header}>
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 rounded-md border border-border/50 bg-muted/30 p-6 text-xs text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" />
          <span>Searching matches...</span>
        </div>
      ) : (
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap wrap-anywhere font-mono rounded-md border border-border/50 bg-muted/30 p-2.5 min-w-0">
          {text || (
            <span className="italic text-muted-foreground">
              No matches found
            </span>
          )}
        </pre>
      )}
    </AccordionItem>
  );
}
