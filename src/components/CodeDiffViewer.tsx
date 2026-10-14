import MarkdownRenderer from "./MarkdownRenderer";

interface CodeDiffViewerProps {
  diff: string;
  filePath?: string;
}

export default function CodeDiffViewer({ diff, filePath }: CodeDiffViewerProps) {
  // Format the file path and diff as pure Markdown
  const markdownContent = [
    filePath ? `\`${filePath}\`` : "",
    "```diff",
    diff.trim(),
    "```",
  ]
    .filter(Boolean)
    .join("\n\n");

  return (
    <div className="text-xs">
      <MarkdownRenderer content={markdownContent} boxless />
    </div>
  );
}
