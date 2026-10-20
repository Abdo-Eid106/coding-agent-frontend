import { Terminal, Folder } from "lucide-react";
import AccordionItem from "./AccordionItem";
import CopyButton from "./CopyButton";

export interface BashToolCallProps {
  command: string;
  output: string;
  cwd: string;
}

export function BashToolCall({ command, output, cwd }: BashToolCallProps) {
  const header = (
    <div className="flex min-w-0 items-center gap-2">
      <Terminal className="size-4 shrink-0 text-muted-foreground" />
      <span className="truncate font-mono text-sm">
        {command.split("\n")[0] || "Command"}
      </span>

      <div
        className="ml-auto flex min-w-0 shrink-0 items-center gap-1 text-xs text-muted-foreground"
        title={cwd}
      >
        <Folder className="size-3.5 shrink-0" />
        <span className="max-w-48 truncate font-mono">{cwd}</span>
      </div>
    </div>
  );

  return (
    <AccordionItem header={header} contentClassName="p-0">
      <div className="overflow-hidden rounded-md border">
        {/* Output */}
        <div className="flex items-start gap-3 px-3 py-2">
          <pre className="max-h-96 min-w-0 flex-1 overflow-auto whitespace-pre-wrap wrap-break-word font-mono text-xs">
            {output || "(no output)"}
          </pre>
          <CopyButton text={output} label="output" />
        </div>
      </div>
    </AccordionItem>
  );
}
