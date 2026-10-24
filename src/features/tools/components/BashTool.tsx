import { Terminal, Folder, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

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

      <span className="min-w-0 flex-1 truncate font-mono text-sm">
        {(command ?? "").split("\n")[0] || "Command"}
      </span>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        {duration && (
          <span className="text-xs font-mono text-muted-foreground">
            {duration}
          </span>
        )}

        {isLoading && (
          <Badge variant="secondary" className="gap-1">
            <Loader2 className="size-3 animate-spin" />
            Running
          </Badge>
        )}

        {cwd && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="hidden max-w-48 min-w-0 items-center gap-1 text-xs text-muted-foreground sm:flex">
                  <Folder className="size-3 shrink-0" />
                  <span className="truncate font-mono">{cwd}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-mono text-xs">{cwd}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );

  return (
    <ToolCallItem header={header}>
      {isLoading ? (
        <div className="flex items-center gap-2 py-3 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          <span>Running command...</span>
        </div>
      ) : (
        <div className="flex min-w-0 items-start gap-3 py-1">
          <ScrollArea className="max-h-96 min-w-0 flex-1">
            <pre className="whitespace-pre-wrap break-all font-mono text-xs leading-relaxed text-foreground/85">
              {output || "(no output)"}
            </pre>
          </ScrollArea>

          <CopyButton text={output ?? ""} label="output" className="shrink-0" />
        </div>
      )}
    </ToolCallItem>
  );
}
