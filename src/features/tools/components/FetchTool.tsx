import ReactMarkdown, { type Components } from "react-markdown";
import { Globe, Loader2 } from "lucide-react";
import AccordionItem from "./AccordionItem";

export interface FetchToolProps {
  url: string;
  /** The `content` string returned by the fetch tool. */
  content?: string;
  /** Same value passed to the tool; the tool defaults to "text". */
  format?: "text" | "markdown";
}

// Open links from fetched pages in a new tab. `node` is stripped so it doesn't reach the DOM.
const markdownComponents: Components = {
  a: ({ node: _node, ...props }) => (
    <a {...props} target="_blank" rel="noopener noreferrer" />
  ),
};

export function FetchTool({ url, content, format = "text" }: FetchToolProps) {
  const isLoading = content === undefined;
  const isEmpty = !isLoading && content.trim() === "";
  const showMarkdown = !isLoading && !isEmpty && format === "markdown";
  const showText = !isLoading && !isEmpty && format !== "markdown";

  const header = (
    <div className="flex min-w-0 items-center gap-2">
      <Globe
        className="size-3.5 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <span className="shrink-0 text-muted-foreground">Fetched</span>
      <span className="truncate font-mono">{url}</span>
      {isLoading ? (
        <span className="ml-auto flex shrink-0 items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
          <Loader2 className="size-3 animate-spin" />
          <span>Fetching...</span>
        </span>
      ) : (
        <span className="ml-auto shrink-0 font-mono text-[11px] text-muted-foreground">
          {content.length.toLocaleString()} chars
        </span>
      )}
    </div>
  );

  return (
    <AccordionItem header={header}>
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 rounded-md border border-border/50 bg-muted/30 p-6 text-xs text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" />
          <span>Fetching content...</span>
        </div>
      ) : (
        <>
          {isEmpty && (
            <p className="italic text-muted-foreground">Empty response</p>
          )}

          {showMarkdown && (
            <div className="prose prose-sm dark:prose-invert max-h-96 max-w-none overflow-auto wrap-break-word text-xs">
              <ReactMarkdown components={markdownComponents}>
                {content}
              </ReactMarkdown>
            </div>
          )}

          {showText && (
            <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-all font-mono rounded-md border border-border/50 bg-muted/30 p-2.5">
              {content}
            </pre>
          )}
        </>
      )}
    </AccordionItem>
  );
}
