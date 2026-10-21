import { Search, Loader2 } from "lucide-react";
import AccordionItem from "./AccordionItem";

export interface GrepToolCallProps {
  pattern: string;
  directory: string;
  /** Plain ripgrep output: one `path:line:text` per line. */
  content?: string;
}

export function GrepTool({ pattern, directory, content }: GrepToolCallProps) {
  const isLoading = !content;

  // Paths come back absolute; strip the searched directory to keep lines short.
  const text = !isLoading ? content.replaceAll(`${directory}/`, "").trim() : "";
  const matchCount = !isLoading && text !== "" ? text.split("\n").length : 0;

  const header = (
    <div className="flex min-w-0 items-center gap-2">
      <Search
        className="size-3.5 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <span className="shrink-0 text-muted-foreground">Grep</span>
      <span className="truncate font-mono">{pattern}</span>
      {isLoading ? (
        <span className="ml-auto flex shrink-0 items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
          <Loader2 className="size-3 animate-spin" />
          <span>Searching...</span>
        </span>
      ) : (
        <span className="ml-auto shrink-0 font-mono text-[11px] text-muted-foreground">
          {matchCount} {matchCount === 1 ? "match" : "matches"}
        </span>
      )}
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
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-all font-mono rounded-md border border-border/50 bg-muted/30 p-2.5">
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
