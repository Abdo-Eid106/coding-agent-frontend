import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import { Wrench, Loader2 } from "lucide-react";
import AccordionItem from "./AccordionItem";
import CopyButton from "./CopyButton";
import { useThemeStore, Theme } from "../../main/hooks/useThemeStore";

hljs.registerLanguage("json", json);

export interface GenericToolProps {
  name: string;
  /** Tool arguments: an object, or a JSON string. */
  input: unknown;
  /** Tool result: an object, a JSON string, or plain text. Leave undefined while the tool is running. */
  output?: unknown;
}

const styles = {
  section: "overflow-hidden rounded-md border border-border bg-muted/30",
  label:
    "flex items-center justify-between border-b border-border bg-muted/50 px-3 py-1 min-h-7.5",
  labelText:
    "text-[10px] font-medium uppercase tracking-wide text-muted-foreground",
  code: "overflow-auto whitespace-pre-wrap wrap-anywhere p-3 font-mono leading-relaxed min-w-0",
};

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

export function GenericTool({ name, input, output }: GenericToolProps) {
  const isDark = useThemeStore((s) => s.effectiveTheme) === Theme.Dark;
  const themeClass = isDark ? "hljs-dark" : "hljs-light";

  const isLoading = !output;
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
      {isLoading && (
        <span className="ml-auto flex shrink-0 items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
          <Loader2 className="size-3 animate-spin" />
          <span className="hidden sm:inline">Running...</span>
        </span>
      )}
    </div>
  );

  return (
    <AccordionItem header={header} contentClassName="space-y-2">
      <div className={styles.section}>
        <div className={styles.label}>
          <span className={styles.labelText}>Input</span>
          {inputRaw && <CopyButton text={inputRaw} label="input" />}
        </div>
        <pre className={`${styles.code} max-h-60 ${themeClass}`}>
          <code
            className="hljs"
            dangerouslySetInnerHTML={{ __html: inputHtml }}
          />
        </pre>
      </div>

      <div className={styles.section}>
        <div className={styles.label}>
          <span className={styles.labelText}>Output</span>
          {!isLoading && outputRaw && (
            <CopyButton text={outputRaw} label="output" />
          )}
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 p-6 text-xs text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" />
            <span>Running tool...</span>
          </div>
        ) : (
          <pre className={`${styles.code} max-h-96 ${themeClass}`}>
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
    </AccordionItem>
  );
}
