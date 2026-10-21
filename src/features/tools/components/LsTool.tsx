import { File, Folder, FolderOpen, Loader2 } from "lucide-react";
import AccordionItem from "./AccordionItem";

export interface LsEntry {
  name: string;
  type: "directory" | "file";
  size?: number;
  modifiedAt?: string;
}

export interface LsToolProps {
  directory: string;
  entries?: LsEntry[];
}

export function LsTool({ directory, entries }: LsToolProps) {
  const isLoading = !entries;
  const count = !isLoading ? entries.length : 0;

  const header = (
    <div className="flex min-w-0 items-center gap-2">
      <FolderOpen
        className="size-3.5 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <span className="shrink-0 text-muted-foreground">Listed</span>
      <span className="truncate font-mono">{directory}</span>
      {isLoading ? (
        <span className="ml-auto flex shrink-0 items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
          <Loader2 className="size-3 animate-spin" />
          <span>Listing...</span>
        </span>
      ) : (
        <span className="ml-auto shrink-0 font-mono text-[11px] text-muted-foreground">
          {count} {count === 1 ? "item" : "items"}
        </span>
      )}
    </div>
  );

  return (
    <AccordionItem header={header}>
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 rounded-md border border-border/50 bg-muted/30 p-6 text-xs text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" />
          <span>Listing directory...</span>
        </div>
      ) : count === 0 ? (
        <p className="italic text-muted-foreground">Empty directory</p>
      ) : (
        <ul className="max-h-96 space-y-0.5 overflow-auto font-mono">
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
                className="flex items-center gap-2 py-0.5"
                style={{ paddingLeft: depth * 16 }}
              >
                <Icon
                  className={`size-3.5 shrink-0 ${iconColor}`}
                  aria-hidden="true"
                />
                <span className="truncate">{parts[depth]}</span>
              </li>
            );
          })}
        </ul>
      )}
    </AccordionItem>
  );
}
