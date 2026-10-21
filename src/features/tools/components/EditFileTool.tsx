import { Pencil, Loader2 } from "lucide-react";
import { DiffView, DiffModeEnum } from "@git-diff-view/react";
import { generateDiffFile } from "@git-diff-view/file";
import AccordionItem from "./AccordionItem";
import "@git-diff-view/react/styles/diff-view.css";

export interface EditFileToolCallProps {
  fileName: string;
  original?: string;
  modified?: string;
  mode?: DiffModeEnum;
}

export function EditFileToolCall({
  fileName,
  original,
  modified,
  mode = DiffModeEnum.Unified,
}: EditFileToolCallProps) {
  const isLoading = original === undefined || modified === undefined;

  let diffFile = null;
  if (!isLoading) {
    const lang = fileName.split(".").pop() ?? "";
    diffFile = generateDiffFile(
      fileName,
      original,
      fileName,
      modified,
      lang,
      lang,
    );

    diffFile.init();
    diffFile.buildSplitDiffLines();
    diffFile.buildUnifiedDiffLines();
  }

  const header = (
    <div className="flex items-center gap-2">
      <Pencil
        className="size-3.5 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <span className="shrink-0 text-muted-foreground">Edited</span>
      <span className="truncate font-mono">{fileName}</span>
      {isLoading ? (
        <span className="ml-auto flex shrink-0 items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
          <Loader2 className="size-3 animate-spin" />
          <span>Applying changes...</span>
        </span>
      ) : (
        <span className="ml-auto shrink-0 font-mono text-[11px]">
          <span className="text-green-500">
            +{diffFile?.additionLength ?? 0}
          </span>{" "}
          <span className="text-red-500">-{diffFile?.deletionLength ?? 0}</span>
        </span>
      )}
    </div>
  );

  return (
    <AccordionItem header={header}>
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 rounded-md border border-border/50 bg-muted/30 p-6 text-xs text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" />
          <span>Applying file changes...</span>
        </div>
      ) : (
        diffFile && (
          <DiffView
            className="cursor-text"
            diffFile={diffFile}
            diffViewMode={mode}
            diffViewTheme={"dark"}
            diffViewHighlight
            diffViewWrap
            diffViewFontSize={11}
          />
        )
      )}
    </AccordionItem>
  );
}
