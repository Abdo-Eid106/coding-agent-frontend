import hljs from "highlight.js";
import {
  FileText,
  FilePenLine,
  Loader2,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatToolDuration } from "../lib/duration";
import CopyButton from "./CopyButton";
import ToolCallItem from "./ToolCalItem";
import ToolErrorDisplay from "./ToolErrorDisplay";

export interface ViewFileToolCallProps {
  filePath: string;
  content?: string;
  mode?: "view" | "write";
  action?: string;
  overwrite?: boolean;
  isLoading?: boolean;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  startedAt?: Date | string | null;
  finishedAt?: Date | string | null;
  error?: { message?: string } | null;
}

export type ViewileToolCallProps = ViewFileToolCallProps;
export type WriteFileToolCallProps = ViewFileToolCallProps;

export function ViewFileToolCall({
  filePath,
  content,
  mode = "view",
  action,
  overwrite,
  isLoading: propIsLoading,
  icon,
  startedAt,
  finishedAt,
  error,
}: ViewFileToolCallProps) {
  const isError = Boolean(error);
  const isWrite = mode === "write";
  const isLoading =
    !isError &&
    (propIsLoading !== undefined
      ? propIsLoading
      : isWrite
        ? Boolean(startedAt && !finishedAt)
        : content === undefined);

  const duration = formatToolDuration(startedAt, finishedAt);

  const hasContent = content !== undefined && content !== null;
  const lineCount =
    !hasContent || content === ""
      ? 0
      : content.split("\n").filter((text) => text.length > 0).length;

  // Unknown extensions fall back to "plaintext", which hljs still HTML-escapes.
  const extension = filePath.split(".").pop() ?? "";
  const language = hljs.getLanguage(extension) ? extension : "plaintext";
  const html =
    hasContent && content !== ""
      ? hljs.highlight(content, {
          language,
          ignoreIllegals: true,
        }).value
      : "";

  const actionText =
    action ?? (isWrite ? (overwrite ? "Overwrite" : "Write") : "View");
  const IconComponent = icon ?? (isWrite ? FilePenLine : FileText);
  const loadingLabel = isWrite ? "Writing..." : "Reading...";
  const loadingBodyText = isWrite ? "Writing file..." : "Reading file...";

  const header = (
    <div className="flex min-w-0 items-center gap-2 w-full">
      <IconComponent
        className="size-3.5 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <span className="shrink-0 text-muted-foreground">{actionText}</span>
      <span className="truncate font-mono min-w-0 flex-1">{filePath}</span>
      <div className="ml-auto flex shrink-0 items-center gap-2 font-mono text-[11px] text-muted-foreground">
        {duration && <span>{duration}</span>}
        {isLoading ? (
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
            <Loader2 className="size-3 animate-spin" />
            <span className="hidden sm:inline">{loadingLabel}</span>
          </span>
        ) : isError ? (
          <Badge variant="destructive" className="gap-1 font-normal text-[11px] h-5 py-0 px-1.5">
            <AlertCircle className="size-3 shrink-0" />
            Failed
          </Badge>
        ) : (
          <span>
            {lineCount} {lineCount === 1 ? "line" : "lines"}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <ToolCallItem defaultOpen={isError} header={header}>
      {isError && <ToolErrorDisplay error={error} />}
      {!isError && hasContent ? (
        content === "" ? (
          <div className="py-2 text-xs text-muted-foreground italic">
            (empty file)
          </div>
        ) : (
          <div className="flex items-start gap-2 py-1 min-w-0">
            <pre className="max-h-96 min-w-0 flex-1 overflow-auto whitespace-pre-wrap wrap-anywhere font-mono text-xs">
              <code className="hljs" dangerouslySetInnerHTML={{ __html: html }} />
            </pre>
            <CopyButton
              text={content}
              label="file content"
              className="shrink-0"
            />
          </div>
        )
      ) : isLoading ? (
        <div className="flex items-center gap-2 py-2 text-xs text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" />
          <span>{loadingBodyText}</span>
        </div>
      ) : (
        !isError && (
          <div className="py-2 text-xs text-muted-foreground italic">
            (no content)
          </div>
        )
      )}
    </ToolCallItem>
  );
}

export function WriteFileToolCall(props: Omit<ViewFileToolCallProps, "mode">) {
  return <ViewFileToolCall mode="write" {...props} />;
}
