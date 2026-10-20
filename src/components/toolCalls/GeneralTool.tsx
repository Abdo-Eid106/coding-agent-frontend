import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import { Wrench } from "lucide-react";
import AccordionItem from "./AccordionItem";
import { useThemeStore, Theme } from "../../store/useThemeStore";

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
    "border-b border-border bg-muted/50 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground",
  code: "overflow-auto whitespace-pre-wrap wrap-break-word p-3 font-mono text-xs leading-relaxed",
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

export function GenericTool({ name, input, output }: GenericToolProps) {
  const isDark = useThemeStore((s) => s.effectiveTheme) === Theme.Dark;
  const themeClass = isDark ? "hljs-dark" : "hljs-light";

  const inputHtml = toHtml(input);
  const outputHtml = toHtml(output);
  const inputPreview =
    (typeof input === "string" ? input : JSON.stringify(input)) ?? "";

  const header = (
    <div className="flex min-w-0 items-center gap-2">
      <Wrench
        className="size-4 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <span className="shrink-0 font-mono">{name}</span>
      <span className="truncate font-mono text-xs text-muted-foreground">
        {inputPreview}
      </span>
    </div>
  );

  return (
    <AccordionItem header={header} contentClassName="space-y-2">
      <div className={styles.section}>
        <div className={styles.label}>Input</div>
        <pre className={`${styles.code} max-h-60 ${themeClass}`}>
          <code
            className="hljs"
            dangerouslySetInnerHTML={{ __html: inputHtml }}
          />
        </pre>
      </div>

      <div className={styles.section}>
        <div className={styles.label}>Output</div>
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
      </div>
    </AccordionItem>
  );
}
