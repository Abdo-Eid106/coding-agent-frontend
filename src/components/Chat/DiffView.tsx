import { useMemo } from "react";
import { DiffView, DiffModeEnum } from "@git-diff-view/react";
import { generateDiffFile } from "@git-diff-view/file";
import "@git-diff-view/react/styles/diff-view.css";
import { useThemeStore } from "../../store/useThemeStore";
import { Theme } from "../../store/useThemeStore";

type Props = {
  fileName: string;
  oldText: string;
  newText: string;
  isDark?: boolean;
  mode?: DiffModeEnum;
};

export function TextDiff({
  fileName,
  oldText,
  newText,
  mode = DiffModeEnum.Unified,
}: Props) {
  const effectiveTheme = useThemeStore((s) => s.effectiveTheme);
  const isDark = effectiveTheme == Theme.Dark;

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
    file.initTheme(isDark ? "dark" : "light");
    file.init();
    file.buildSplitDiffLines();
    file.buildUnifiedDiffLines();
    return file;
  }, [fileName, oldText, newText, isDark]);

  return (
    <DiffView
      className="cursor-text"
      diffFile={diffFile}
      diffViewMode={mode}
      diffViewTheme={isDark ? "dark" : "light"}
      diffViewHighlight
      diffViewWrap
      diffViewFontSize={12}
    />
  );
}
