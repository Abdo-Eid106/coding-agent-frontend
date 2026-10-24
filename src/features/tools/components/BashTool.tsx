import { Folder, Loader2, Terminal } from "lucide-react";

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

interface BashToolHeaderProps {
  command?: string;
  cwd?: string;
  duration: string | null;
  isLoading: boolean;
}

function WorkingDirectory({ cwd }: { cwd: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={
            <span className="hidden max-w-48 min-w-0 cursor-default items-center gap-1 text-xs text-muted-foreground sm:flex" />
          }
        >
          <Folder className="size-3 shrink-0" />
          <span className="truncate font-mono">{cwd}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-mono text-xs">{cwd}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function BashToolHeader({
  command,
  cwd,
  duration,
  isLoading,
}: BashToolHeaderProps) {
  return (
    <div className="text-xs flex w-full min-w-0 items-center gap-2">
      <Terminal className="size-3.5 shrink-0 text-muted-foreground" />

      <span className="min-w-0 flex-1 truncate font-mono">
        {command?.split("\n")[0] || "Command"}
      </span>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        {duration && (
          <span className="font-mono text-muted-foreground">{duration}</span>
        )}

        {isLoading && (
          <Badge variant="secondary" className="gap-1">
            <Loader2 className="size-3 animate-spin" />
            Running
          </Badge>
        )}

        {cwd && <WorkingDirectory cwd={cwd} />}
      </div>
    </div>
  );
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

  return (
    <ToolCallItem
      header={
        <BashToolHeader
          command={command}
          cwd={cwd}
          duration={duration}
          isLoading={isLoading}
        />
      }
    >
      {isLoading ? (
        <div className="flex items-center gap-2 py-3 text-xs text-muted-foreground">
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
