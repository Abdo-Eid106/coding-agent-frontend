import hljs from "highlight.js";
import { FileText } from "lucide-react";
import AccordionItem from "./AccordionItem";
import CopyButton from "./CopyButton";

export interface ViewileToolCallProps {
  fileName: string;
  content: string;
}

export function ViewFileToolCall({ fileName, content }: ViewileToolCallProps) {
  const lineCount =
    content === ""
      ? 0
      : content.split("\n").filter((text) => text.length > 0).length;

  // Unknown extensions fall back to "plaintext", which hljs still HTML-escapes.
  const extension = fileName.split(".").pop() ?? "";
  const language = hljs.getLanguage(extension) ? extension : "plaintext";
  const html = hljs.highlight(content, {
    language,
    ignoreIllegals: true,
  }).value;

  const header = (
    <div className="flex items-center gap-2">
      <FileText
        className="size-3.5 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <span className="shrink-0 text-muted-foreground">View</span>
      <span className="truncate font-mono">{fileName}</span>
      <span className="ml-auto shrink-0 font-mono text-[11px] text-muted-foreground">
        {lineCount} {lineCount === 1 ? "line" : "lines"}
      </span>
    </div>
  );

  return (
    <AccordionItem header={header}>
      <div className="flex items-start gap-2 rounded-md border border-border/50 bg-muted/30 p-2.5">
        <pre className="max-h-96 min-w-0 flex-1 overflow-auto whitespace-pre-wrap wrap-break-word font-mono">
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
    </AccordionItem>
  );
}
