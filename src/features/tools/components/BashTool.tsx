import { Terminal, Folder, Loader2 } from "lucide-react";
import AccordionItem from "./AccordionItem";
import CopyButton from "./CopyButton";

export interface BashToolCallProps {
  command: string;
  output?: string;
  cwd?: string;
}

export function BashToolCall({ command, output, cwd }: BashToolCallProps) {
  const isLoading = !output;

  const header = (
    <div className="flex min-w-0 items-center gap-2">
      <Terminal className="size-3.5 shrink-0 text-muted-foreground" />
      <span className="truncate font-mono">
        {command.split("\n")[0] || "Command"}
      </span>

      <div className="ml-auto flex min-w-0 shrink-0 items-center gap-2 text-[11px] text-muted-foreground">
        {isLoading && (
          <span className="flex items-center gap-1.5 font-mono">
            <Loader2 className="size-3 animate-spin" />
            <span>Running...</span>
          </span>
        )}
        {cwd && (
          <div
            className="flex min-w-0 shrink-0 items-center gap-1 font-mono"
            title={cwd}
          >
            <Folder className="size-3 shrink-0" />
            <span className="max-w-48 truncate">{cwd}</span>
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
        <div className="overflow-hidden rounded-md border border-border/50 bg-muted/30">
          {/* Output */}
          <div className="flex items-start gap-3 px-3 py-2">
            <pre className="max-h-96 min-w-0 flex-1 overflow-auto whitespace-pre-wrap wrap-break-word font-mono">
              {output || "(no output)"}
            </pre>
            <CopyButton text={output ?? ""} label="output" />
          </div>
        </div>
      )}
    </AccordionItem>
  );
}
