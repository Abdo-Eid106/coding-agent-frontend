import { Terminal, Folder, Loader2 } from "lucide-react";
import { formatToolDuration } from "../lib/duration";
import ToolCallItem from "./ToolCalItem";
import CopyButton from "./CopyButton";

export interface BashToolCallProps {
  command?: string;
  output?: string;
  cwd?: string;
  startedAt?: Date | string | null;
  finishedAt?: Date | string | null;
}

export function BashToolCall({
  command,
  output,
  cwd,
  startedAt,
  finishedAt,
}: BashToolCallProps) {
  const isLoading = output === undefined;
  const duration = formatToolDuration(startedAt, finishedAt);

  const header = (
    <div className="flex w-full min-w-0 items-center gap-2">
      <Terminal className="size-3.5 shrink-0 text-muted-foreground" />
      <span className="min-w-0 flex-1 truncate font-mono">
        {(command ?? "").split("\n")[0] || "Command"}
      </span>

      <div className="ml-auto flex min-w-0 shrink-0 items-center gap-2 text-[11px] text-muted-foreground">
        {duration && <span className="font-mono">{duration}</span>}
        {isLoading && (
          <span className="flex items-center gap-1.5 font-mono">
            <Loader2 className="size-3 animate-spin" />
            <span className="hidden sm:inline">Running...</span>
          </span>
        )}
        {cwd && (
          <div
            className="hidden min-w-0 shrink-0 items-center gap-1 font-mono sm:flex"
            title={cwd}
          >
            <Folder className="size-3 shrink-0" />
            <span className="max-w-32 truncate md:max-w-48">{cwd}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <ToolCallItem header={header}>
      {isLoading ? (
        <div className="flex items-center gap-2 py-2 text-xs text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" />
          <span>Running command...</span>
        </div>
      ) : (
        <div className="flex min-w-0 items-start gap-3 py-1">
          <pre className="max-h-96 min-w-0 flex-1 overflow-auto whitespace-pre-wrap font-mono text-xs text-foreground/85 wrap-anywhere">
            {output || "(no output)"}
          </pre>
          <CopyButton text={output ?? ""} label="output" className="shrink-0" />
        </div>
      )}
    </ToolCallItem>
  );
}
