import { Search } from "lucide-react";
import AccordionItem from "./AccordionItem";

export interface GrepToolCallProps {
  pattern: string;
  directory: string;
  /** Plain ripgrep output: one `path:line:text` per line. */
  content: string;
}

export function GrepTool({
  pattern,
  directory,
  content,
}: GrepToolCallProps) {
  // Paths come back absolute; strip the searched directory to keep lines short.
  const text = content.replaceAll(`${directory}/`, "").trim();
  const matchCount = text === "" ? 0 : text.split("\n").length;

  const header = (
    <div className="flex min-w-0 items-center gap-2">
      <Search
        className="size-4 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <span className="shrink-0 text-muted-foreground">Grep</span>
      <span className="truncate font-mono">{pattern}</span>
      <span className="ml-auto shrink-0 font-mono text-xs text-muted-foreground">
        {matchCount} {matchCount === 1 ? "match" : "matches"}
      </span>
    </div>
  );

  return (
    <AccordionItem header={header}>
      <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-all font-mono text-xs">
        {text || (
          <span className="italic text-muted-foreground">No matches found</span>
        )}
      </pre>
    </AccordionItem>
  );
}
