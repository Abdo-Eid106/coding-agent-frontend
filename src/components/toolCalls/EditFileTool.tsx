import { Pencil } from "lucide-react";
import { DiffView, DiffModeEnum } from "@git-diff-view/react";
import { generateDiffFile } from "@git-diff-view/file";
import AccordionItem from "./AccordionItem";
import "@git-diff-view/react/styles/diff-view.css";

export interface EditFileToolCallProps {
  fileName: string;
  oldText: string;
  newText: string;
  mode?: DiffModeEnum;
}

export function EditFileToolCall({
  fileName,
  oldText,
  newText,
  mode = DiffModeEnum.Unified,
}: EditFileToolCallProps) {
  const lang = fileName.split(".").pop() ?? "";
  const diffFile = generateDiffFile(
    fileName,
    oldText,
    fileName,
    newText,
    lang,
    lang,
  );

  diffFile.init();
  diffFile.buildSplitDiffLines();
  diffFile.buildUnifiedDiffLines();

  const header = (
    <div className="flex items-center gap-2">
      <Pencil
        className="size-4 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <span className="shrink-0 text-muted-foreground">Edited</span>
      <span className="truncate font-mono">{fileName}</span>
      <span className="ml-auto shrink-0 font-mono text-xs">
        <span className="text-green-500">+{diffFile.additionLength}</span>{" "}
        <span className="text-red-500">-{diffFile.deletionLength}</span>
      </span>
    </div>
  );

  return (
    <AccordionItem header={header}>
      <DiffView
        className="cursor-text"
        diffFile={diffFile}
        diffViewMode={mode}
        diffViewTheme={"dark"}
        diffViewHighlight
        diffViewWrap
        diffViewFontSize={12}
      />
    </AccordionItem>
  );
}
