import { useState } from "react";
import {
  ChevronRight,
  Terminal,
  FileCode,
  FileEdit,
  FilePlus,
  CheckCircle2,
  AlertCircle,
  Wrench,
} from "lucide-react";
import type { ToolCall } from "../store/types";
import MarkdownRenderer from "./MarkdownRenderer";

interface ToolCallsAccordionProps {
  toolCalls: ToolCall[];
  defaultOpen?: boolean;
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
    default:
      return <Wrench className="size-3.5 text-muted-foreground shrink-0" />;
  }
}

function isDiffToolCall(tc: ToolCall): boolean {
  if (tc.diff) return true;
  if (tc.tool === "replace_file_content" || tc.tool === "edit_file") {
    return Boolean(
      tc.diff ||
        tc.output.includes("@@") ||
        tc.output.includes("\n+") ||
        tc.output.includes("\n-"),
    );
  }
  return tc.output.includes("@@ -") || tc.output.startsWith("--- ");
}

function formatToolOutputAsMarkdown(tc: ToolCall): string {
  const isDiff = isDiffToolCall(tc);
  if (isDiff) {
    const diffContent = (tc.diff || tc.output).trim();
    const fileHeader =
      tc.filePath || tc.summary ? `\`${tc.filePath || tc.summary}\`\n\n` : "";
    return `${fileHeader}\`\`\`diff\n${diffContent}\n\`\`\``;
  }

  const raw = tc.output.trim();
  // If already formatted with markdown blocks/headers
  if (
    raw.startsWith("```") ||
    raw.includes("\n```") ||
    raw.startsWith("#") ||
    raw.startsWith("> ")
  ) {
    return raw;
  }

  // Format terminal commands as bash code blocks in markdown
  if (tc.tool === "run_command") {
    return `\`\`\`bash\n${raw}\n\`\`\``;
  }

  // Format all other tool outputs as clean markdown code blocks
  return `\`\`\`\n${raw}\n\`\`\``;
}

export default function ToolCallsAccordion({
  toolCalls,
  defaultOpen = false,
}: ToolCallsAccordionProps) {
  // Track open state of the whole tool executions section (default closed)
  const [isSectionOpen, setIsSectionOpen] = useState(defaultOpen);

  // Track open state per individual tool call item
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!toolCalls || toolCalls.length === 0) return null;

  return (
    <div className="my-3 space-y-1.5">
      {/* Collapsible main header for the entire tool executions section - without boxes */}
      <button
        type="button"
        onClick={() => setIsSectionOpen((prev) => !prev)}
        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground uppercase tracking-wider px-1 py-1 cursor-pointer select-none transition-colors group"
        title={isSectionOpen ? "Collapse tool executions" : "Expand tool executions"}
      >
        <ChevronRight
          className={`size-3.5 transition-transform duration-200 text-muted-foreground group-hover:text-foreground ${
            isSectionOpen ? "rotate-90" : "rotate-0"
          }`}
        />
        <span>Tool executions ({toolCalls.length})</span>
      </button>

      {/* Smoothly animated collapsible list of tool calls without card boxes */}
      <div
        className={`grid transition-all duration-200 ease-in-out ${
          isSectionOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden space-y-1 pt-0.5">
          {toolCalls.map((tc) => {
            const isOpen = Boolean(openItems[tc.id]);

            return (
              <div key={tc.id} className="text-xs">
                {/* Accordion Item Header - without box, clean row on page background */}
                <button
                  type="button"
                  onClick={() => toggleItem(tc.id)}
                  className="flex items-center justify-between w-full py-1 px-1.5 text-left text-xs transition-colors hover:bg-accent/40 rounded-md cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <ChevronRight
                      className={`size-3.5 transition-transform duration-200 text-muted-foreground group-hover:text-foreground shrink-0 ${
                        isOpen ? "rotate-90" : "rotate-0"
                      }`}
                    />
                    {getToolIcon(tc.tool)}
                    <span className="font-mono font-medium text-foreground truncate">
                      {tc.tool}
                    </span>
                    {tc.summary && (
                      <span className="font-mono text-muted-foreground truncate hidden sm:inline">
                        ({tc.summary})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {tc.duration && (
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {tc.duration}
                      </span>
                    )}
                    {tc.status === "error" ? (
                      <AlertCircle className="size-3.5 text-destructive shrink-0" />
                    ) : (
                      <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                    )}
                  </div>
                </button>

                {/* Accordion Item Collapsible Body - without box, indented directly on page background */}
                <div
                  className={`grid transition-all duration-200 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pl-6 pr-1 py-1 text-xs">
                      <MarkdownRenderer
                        content={formatToolOutputAsMarkdown(tc)}
                        boxless
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
