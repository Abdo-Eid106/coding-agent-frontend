import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import { Wrench, Loader2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import CopyButton from "./CopyButton";
import { useThemeStore, Theme } from "../../main/hooks/useThemeStore";
import { formatToolDuration } from "../lib/duration";
import ToolCallItem from "./ToolCalItem";
import ToolErrorDisplay from "./ToolErrorDisplay";

hljs.registerLanguage("json", json);

export interface GenericToolProps {
  name: string;
  /** Tool arguments: an object, or a JSON string. */
  input: unknown;
  /** Tool result: an object, a JSON string, or plain text. Leave undefined while the tool is running. */
  output?: unknown;
  startedAt?: Date | string | null;
  finishedAt?: Date | string | null;
  error?: { message?: string } | null;
}

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Pretty-prints JSON (object or JSON string) as highlighted HTML; anything else is escaped as plain text. */
function toHtml(value: unknown): string {
  if (value === undefined) return "";

  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    return hljs.highlight(JSON.stringify(parsed, null, 2), { language: "json" })
      .value;
  } catch {
    return escapeHtml(String(value));
  }
}

/** Formats JSON or returns raw text for copying to clipboard. */
function toRawText(value: unknown): string {
  if (value === undefined || value === null) return "";
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return value;
    }
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export function GenericTool({
  name,
  input,
  output,
  startedAt,
  finishedAt,
  error,
}: GenericToolProps) {
  const isDark = useThemeStore((s) => s.theme) === Theme.Dark;
  const themeClass = isDark ? "hljs-dark" : "hljs-light";

  const isError = Boolean(error);
  const isLoading = !isError && !output;
  const duration = formatToolDuration(startedAt, finishedAt);
  const inputHtml = toHtml(input);
  const outputHtml = toHtml(output);
  const inputRaw = toRawText(input);
  const outputRaw = toRawText(output);
  const inputPreview =
    (typeof input === "string" ? input : JSON.stringify(input)) ?? "";

  const header = (
    <div className="flex min-w-0 items-center gap-2 w-full">
      <Wrench
        className="size-3.5 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <span className="shrink-0 font-mono">{name}</span>
      <span className="truncate font-mono text-[11px] text-muted-foreground min-w-0 flex-1">
        {inputPreview}
      </span>
      <div className="ml-auto flex shrink-0 items-center gap-2 font-mono text-[11px] text-muted-foreground">
        {duration && <span>{duration}</span>}
        {isLoading && (
          <span className="flex items-center gap-1.5">
            <Loader2 className="size-3 animate-spin" />
            <span className="hidden sm:inline">Running...</span>
          </span>
        )}
        {isError && (
          <Badge variant="destructive" className="gap-1 font-normal text-[11px] h-5 py-0 px-1.5">
            <AlertCircle className="size-3 shrink-0" />
            Failed
          </Badge>
        )}
      </div>
    </div>
  );

  return (
    <ToolCallItem defaultOpen={isError} header={header} contentClassName="space-y-2">
      <div>
        <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wide text-muted-foreground py-0.5">
          <span>Input</span>
          {inputRaw && <CopyButton text={inputRaw} label="input" />}
        </div>
        <pre
          className={`overflow-auto whitespace-pre-wrap wrap-anywhere font-mono text-xs leading-relaxed max-h-60 py-1 text-foreground/85 ${themeClass}`}
        >
          <code
            className="hljs"
            dangerouslySetInnerHTML={{ __html: inputHtml }}
          />
        </pre>
      </div>

      {isError && <ToolErrorDisplay error={error} />}

      {(output !== undefined || !isError) && (
        <div>
          <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wide text-muted-foreground py-0.5">
            <span>Output</span>
            {!isLoading && outputRaw && (
              <CopyButton text={outputRaw} label="output" />
            )}
          </div>
          {isLoading ? (
            <div className="flex items-center gap-2 py-2 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              <span>Running tool...</span>
            </div>
          ) : (
            <pre
              className={`overflow-auto whitespace-pre-wrap wrap-anywhere font-mono text-xs leading-relaxed max-h-96 py-1 text-foreground/85 ${themeClass}`}
            >
              {outputHtml ? (
                <code
                  className="hljs"
                  dangerouslySetInnerHTML={{ __html: outputHtml }}
                />
              ) : (
                <span className="italic text-muted-foreground">(no output)</span>
              )}
            </pre>
          )}
        </div>
      )}
    </ToolCallItem>
  );
}
