import { Pencil, Loader2, AlertCircle } from "lucide-react";
import { DiffView, DiffModeEnum } from "@git-diff-view/react";
import { generateDiffFile } from "@git-diff-view/file";

import { Badge } from "@/components/ui/badge";

import { formatToolDuration } from "../lib/duration";
import ToolCallItem from "./ToolCalItem";
import ToolErrorDisplay from "./ToolErrorDisplay";

import "@git-diff-view/react/styles/diff-view.css";

export interface EditFileToolCallProps {
  filePath: string;
  original?: string;
  modified?: string;
  mode?: DiffModeEnum;
  startedAt?: Date | string | null;
  finishedAt?: Date | string | null;
  error?: { message?: string } | null;
}

function EditFileHeader({
  filePath,
  duration,
  isLoading,
  isError,
  additions,
  deletions,
}: {
  filePath: string;
  duration: string | null;
  isLoading: boolean;
  isError: boolean;
  additions: number;
  deletions: number;
}) {
  return (
    <div className="text-sm flex w-full min-w-0 items-center gap-2">
      <Pencil
        className="size-3.5 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />

      <Badge variant="secondary" className="shrink-0 font-normal">
        Edited
      </Badge>

      <span className="min-w-0 flex-1 truncate font-mono">{filePath}</span>
      <div className="ml-auto flex shrink-0 items-center gap-2 font-mono">
        {duration && <span className="text-muted-foreground">{duration}</span>}

        {isLoading ? (
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Loader2 className="size-3 animate-spin" />
            <span className="hidden sm:inline">Applying changes...</span>
          </span>
        ) : isError ? (
          <Badge variant="destructive" className="gap-1 font-normal text-[11px] h-5 py-0 px-1.5">
            <AlertCircle className="size-3 shrink-0" />
            Failed
          </Badge>
        ) : (
          <span className="whitespace-nowrap">
            <span className="text-green-500">+{additions}</span>{" "}
            <span className="text-red-500">-{deletions}</span>
          </span>
        )}
      </div>
    </div>
  );
}

export function EditFileToolCall({
  filePath,
  original,
  modified,
  mode = DiffModeEnum.Unified,
  startedAt,
  finishedAt,
  error,
}: EditFileToolCallProps) {
  const isError = Boolean(error);
  const isLoading =
    !isError && (original === undefined || modified === undefined);
  const duration = formatToolDuration(startedAt, finishedAt);

  const diffFile =
    !isLoading &&
    !isError &&
    original !== undefined &&
    modified !== undefined
      ? generateDiffFile(
          filePath,
          original,
          filePath,
          modified,
          filePath.split(".").pop() ?? "",
          filePath.split(".").pop() ?? "",
        )
      : null;

  if (diffFile) {
    diffFile.init();
    diffFile.buildSplitDiffLines();
    diffFile.buildUnifiedDiffLines();
  }

  return (
    <ToolCallItem
      defaultOpen={isError}
      header={
        <EditFileHeader
          filePath={filePath}
          duration={duration}
          isLoading={isLoading}
          isError={isError}
          additions={diffFile?.additionLength ?? 0}
          deletions={diffFile?.deletionLength ?? 0}
        />
      }
    >
      {isError && <ToolErrorDisplay error={error} />}
      {isLoading ? (
        <div className="flex items-center gap-2 py-3 text-sm text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" />
          <span>Applying file changes...</span>
        </div>
      ) : diffFile ? (
        <div className="w-full min-w-0 overflow-x-auto py-1">
          <DiffView
            className="cursor-text"
            diffFile={diffFile}
            diffViewMode={mode}
            diffViewTheme="dark"
            diffViewHighlight
            diffViewWrap
            diffViewFontSize={12}
          />
        </div>
      ) : null}
    </ToolCallItem>
  );
}
