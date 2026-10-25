import { File, Folder, FolderOpen, Loader2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatToolDuration } from "../lib/duration";
import ToolCallItem from "./ToolCalItem";
import ToolErrorDisplay from "./ToolErrorDisplay";

export interface LsEntry {
  name: string;
  type: "directory" | "file";
  size?: number;
  modifiedAt?: string;
}

export interface LsToolProps {
  directory: string;
  entries?: LsEntry[];
  startedAt?: Date | string | null;
  finishedAt?: Date | string | null;
  error?: { message?: string } | null;
}

export function LsTool({
  directory,
  entries,
  startedAt,
  finishedAt,
  error,
}: LsToolProps) {
  const isError = Boolean(error);
  const isLoading = !isError && !entries;
  const count = entries?.length ?? 0;
  const duration = formatToolDuration(startedAt, finishedAt);

  const header = (
    <div className="flex min-w-0 items-center gap-2 w-full">
      <FolderOpen
        className="size-3.5 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <span className="shrink-0 text-muted-foreground">Listed</span>
      <span className="truncate font-mono min-w-0 flex-1">{directory}</span>
      <div className="ml-auto flex shrink-0 items-center gap-2 font-mono text-[11px] text-muted-foreground">
        {duration && <span>{duration}</span>}
        {isLoading ? (
          <span className="flex items-center gap-1.5">
            <Loader2 className="size-3 animate-spin" />
            <span className="hidden sm:inline">Listing...</span>
          </span>
        ) : isError ? (
          <Badge variant="destructive" className="gap-1 font-normal text-[11px] h-5 py-0 px-1.5">
            <AlertCircle className="size-3 shrink-0" />
            Failed
          </Badge>
        ) : (
          <span>
            {count} {count === 1 ? "item" : "items"}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <ToolCallItem defaultOpen={isError} header={header}>
      {isError && <ToolErrorDisplay error={error} />}
      {isLoading ? (
        <div className="flex items-center gap-2 py-2 text-xs text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" />
          <span>Listing directory...</span>
        </div>
      ) : !isError && count === 0 ? (
        <p className="italic text-muted-foreground py-1">Empty directory</p>
      ) : entries ? (
        <ul className="max-h-96 space-y-0.5 overflow-x-auto overflow-y-auto font-mono text-xs min-w-0">
          {entries.map(({ name, type }) => {
            // `name` is a path relative to `directory`, e.g. "src/utils/math.ts"
            const parts = name.split(/[\\/]/);
            const depth = parts.length - 1;
            const Icon = type === "directory" ? Folder : File;
            const iconColor =
              type === "directory" ? "text-sky-500" : "text-muted-foreground";

            return (
              <li
                key={name}
                className="flex items-center gap-2 py-0.5 min-w-0"
                style={{ paddingLeft: depth * 16 }}
              >
                <Icon
                  className={`size-3.5 shrink-0 ${iconColor}`}
                  aria-hidden="true"
                />
                <span className="truncate min-w-0">{parts[depth]}</span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </ToolCallItem>
  );
}
