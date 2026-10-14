import { useState } from "react";
import {
  ChevronRight,
  Terminal,
  FileCode,
  FileEdit,
  FilePlus,
  CheckCircle2,
  AlertCircle,
  FileText,
  Wrench,
} from "lucide-react";
import type { ToolCall } from "../../store/types";
import MarkdownRenderer from "../MarkdownRenderer";

interface ToolCallItemProps {
  toolCall: ToolCall;
}

function getToolIcon(toolName: string) {
  switch (toolName) {
    case "run_command":
      return <Terminal className="size-3.5 text-primary shrink-0" />;
    case "view_file":
    case "read_resource":
      return <FileCode className="size-3.5 text-foreground shrink-0" />;
    case "replace_file_content":
    case "edit_file":
      return <FileEdit className="size-3.5 text-primary shrink-0" />;
    case "write_to_file":
      return <FilePlus className="size-3.5 text-primary shrink-0" />;
    case "text":
      return <FileText className="size-3.5 text-muted-foreground shrink-0" />;
    default:
      return <Wrench className="size-3.5 text-muted-foreground shrink-0" />;
  }
}

function detectLanguageFromPath(filePath?: string): string {
  if (!filePath) return "typescript";
  const ext = filePath.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "ts":
    case "tsx":
      return "typescript";
    case "js":
    case "jsx":
      return "javascript";
    case "json":
      return "json";
    case "css":
      return "css";
    case "html":
      return "html";
    case "sh":
    case "bash":
      return "bash";
    case "py":
      return "python";
    case "md":
      return "markdown";
    default:
      return "typescript";
  }
}

function isDiffOutput(tc: ToolCall): boolean {
  if (tc.diff) return true;
  if (tc.tool === "replace_file_content" || tc.tool === "edit_file") return true;
  return tc.output.includes("@@ -") || tc.output.startsWith("--- ");
}

function formatMarkdown(tc: ToolCall): string {
  const filePath = tc.filePath || tc.summary;
  const lang = detectLanguageFromPath(filePath);

  if (tc.tool === "run_command") {
    const cmd = tc.summary ? `$ ${tc.summary}\n` : "";
    return `\`\`\`bash\n${cmd}${tc.output.trim()}\n\`\`\``;
  }

  if (tc.tool === "replace_file_content" || tc.tool === "edit_file") {
    const diffContent = (tc.diff || tc.output).trim();
    const header = filePath ? `\`${filePath}\`\n\n` : "";
    return `${header}\`\`\`diff\n${diffContent}\n\`\`\``;
  }

  if (tc.tool === "view_file" || tc.tool === "read_resource" || tc.tool === "write_to_file") {
    const header = filePath ? `\`${filePath}\`\n\n` : "";
    return `${header}\`\`\`${lang}\n${tc.output.trim()}\n\`\`\``;
  }

  if (tc.tool === "text") {
    return tc.output.trim();
  }

  if (isDiffOutput(tc)) {
    const diffContent = (tc.diff || tc.output).trim();
    return `\`\`\`diff\n${diffContent}\n\`\`\``;
  }

  const raw = tc.output.trim();
  if (raw.startsWith("```") || raw.startsWith("#") || raw.startsWith("> ")) {
    return raw;
  }

  return `\`\`\`\n${raw}\n\`\`\``;
}

export default function ToolCallItem({ toolCall }: ToolCallItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="text-xs">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between w-full py-1 px-1.5 text-left text-xs transition-colors hover:bg-accent/40 rounded-md cursor-pointer select-none group"
      >
        <div className="flex items-center gap-2 min-w-0">
          <ChevronRight
            className={`size-3.5 transition-transform duration-200 text-muted-foreground group-hover:text-foreground shrink-0 ${
              isOpen ? "rotate-90" : "rotate-0"
            }`}
          />
          {getToolIcon(toolCall.tool)}
          <span className="font-mono font-medium text-foreground truncate">
            {toolCall.tool}
          </span>
          {toolCall.summary && (
            <span className="font-mono text-muted-foreground truncate hidden sm:inline">
              ({toolCall.summary})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-2">
          {toolCall.duration && (
            <span className="text-[11px] text-muted-foreground font-mono">
              {toolCall.duration}
            </span>
          )}
          {toolCall.status === "error" ? (
            <AlertCircle className="size-3.5 text-destructive shrink-0" />
          ) : (
            <CheckCircle2 className="size-3.5 text-primary shrink-0" />
          )}
        </div>
      </button>

      <div
        className={`grid transition-all duration-200 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pl-6 pr-1 py-1 text-xs">
            <MarkdownRenderer content={formatMarkdown(toolCall)} boxless />
          </div>
        </div>
      </div>
    </div>
  );
}
