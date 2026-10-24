import { Pencil, Loader2 } from "lucide-react";
import { DiffView, DiffModeEnum } from "@git-diff-view/react";
import { generateDiffFile } from "@git-diff-view/file";
import { formatToolDuration } from "../lib/duration";
import ToolCallItem from "./ToolCalItem";
import "@git-diff-view/react/styles/diff-view.css";

export interface EditFileToolCallProps {
  filePath: string;
  original?: string;
  modified?: string;
  mode?: DiffModeEnum;
  startedAt?: Date | string | null;
  finishedAt?: Date | string | null;
}

export function EditFileToolCall({
  filePath,
  original,
  modified,
  mode = DiffModeEnum.Unified,
  startedAt,
  finishedAt,
}: EditFileToolCallProps) {
  const isLoading = !original || !modified;
  const duration = formatToolDuration(startedAt, finishedAt);

  let diffFile = null;
  if (!isLoading) {
    const lang = filePath.split(".").pop() ?? "";
    diffFile = generateDiffFile(
      filePath,
      original,
      filePath,
      modified,
      lang,
      lang,
    );

    diffFile.init();
    diffFile.buildSplitDiffLines();
    diffFile.buildUnifiedDiffLines();
  }

  const header = (
    <div className="flex min-w-0 items-center gap-2 w-full">
      <Pencil
        className="size-3.5 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <span className="shrink-0 text-muted-foreground">Edited</span>
      <span className="truncate font-mono min-w-0 flex-1">{filePath}</span>
      <div className="ml-auto flex shrink-0 items-center gap-2 font-mono text-[11px]">
        {duration && <span className="text-muted-foreground">{duration}</span>}
        {isLoading ? (
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Loader2 className="size-3 animate-spin" />
            <span className="hidden sm:inline">Applying changes...</span>
          </span>
        ) : (
          <span>
            <span className="text-green-500">
              +{diffFile?.additionLength ?? 0}
            </span>{" "}
            <span className="text-red-500">
              -{diffFile?.deletionLength ?? 0}
            </span>
          </span>
        )}
      </div>
    </div>
  );

  return (
    <ToolCallItem header={header}>
      {isLoading ? (
        <div className="flex items-center gap-2 py-2 text-xs text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" />
          <span>Applying file changes...</span>
        </div>
      ) : (
        diffFile && (
          <div className="w-full min-w-0 overflow-x-auto py-1">
            <DiffView
              className="cursor-text"
              diffFile={diffFile}
              diffViewMode={mode}
              diffViewTheme={"dark"}
              diffViewHighlight
              diffViewWrap
              diffViewFontSize={11}
            />
          </div>
        )
      )}
    </ToolCallItem>
  );
}
