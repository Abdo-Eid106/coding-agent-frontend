import { useMemo } from "react";
import { FileText } from "lucide-react";
import { DiffView, DiffModeEnum } from "@git-diff-view/react";
import { generateDiffFile } from "@git-diff-view/file";
import "@git-diff-view/react/styles/diff-view.css";
import AccordionItem from "../AccordionItem";
import { Theme, useThemeStore } from "../../store/useThemeStore";

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
  const isDark = useThemeStore((s) => s.effectiveTheme) === Theme.Dark;
  const theme = isDark ? "dark" : "light";

  const diffFile = useMemo(() => {
    const lang = fileName.split(".").pop() ?? "";
    const file = generateDiffFile(
      fileName,
      oldText,
      fileName,
      newText,
      lang,
      lang,
    );

    file.initTheme(theme);
    file.init();
    file.buildSplitDiffLines();
    file.buildUnifiedDiffLines();

    return file;
  }, [fileName, oldText, newText, theme]);

  const header = (
    <div className="flex items-center gap-2">
      <FileText
        className="size-4 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
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
        diffViewTheme={theme}
        diffViewHighlight
        diffViewWrap
        diffViewFontSize={12}
      />
    </AccordionItem>
  );
}
