import { Terminal, Folder, Loader2 } from "lucide-react";
import AccordionItem from "./AccordionItem";
import CopyButton from "./CopyButton";

export interface BashToolCallProps {
  command?: string;
  output?: string;
  cwd?: string;
}

export function BashToolCall({ command, output, cwd }: BashToolCallProps) {
  const isLoading = output === undefined;

  const header = (
    <div className="flex min-w-0 items-center gap-2 w-full">
      <Terminal className="size-3.5 shrink-0 text-muted-foreground" />
      <span className="truncate font-mono min-w-0 flex-1">
        {(command ?? "").split("\n")[0] || "Command"}
      </span>

      <div className="ml-auto flex min-w-0 shrink-0 items-center gap-2 text-[11px] text-muted-foreground">
        {isLoading && (
          <span className="flex items-center gap-1.5 font-mono">
            <Loader2 className="size-3 animate-spin" />
            <span className="hidden sm:inline">Running...</span>
          </span>
        )}
        {cwd && (
          <div
            className="hidden sm:flex min-w-0 shrink-0 items-center gap-1 font-mono"
            title={cwd}
          >
            <Folder className="size-3 shrink-0" />
            <span className="max-w-32 md:max-w-48 truncate">{cwd}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <AccordionItem header={header}>
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 rounded-md border border-border/50 bg-muted/30 p-6 text-xs text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" />
          <span>Running command...</span>
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border border-border/50 bg-muted/30 min-w-0">
          {/* Output */}
          <div className="flex items-start gap-3 px-3 py-2 min-w-0">
            <pre className="max-h-96 min-w-0 flex-1 overflow-auto whitespace-pre-wrap wrap-anywhere font-mono">
              {output || "(no output)"}
            </pre>
            <CopyButton
              text={output ?? ""}
              label="output"
              className="shrink-0"
            />
          </div>
        </div>
      )}
    </AccordionItem>
  );
}
