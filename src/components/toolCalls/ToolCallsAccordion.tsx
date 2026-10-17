import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { type ToolCall } from "../../store/types";
import ToolCallItem from "./ToolCallItem";

interface ToolCallsAccordionProps {
  toolCalls: ToolCall[];
  defaultOpen?: boolean;
}

export default function ToolCallsAccordion({
  toolCalls,
  defaultOpen = false,
}: ToolCallsAccordionProps) {
  const [isSectionOpen, setIsSectionOpen] = useState(defaultOpen);

  if (!toolCalls || toolCalls.length === 0) return null;

  return (
    <div className="my-3 space-y-1.5">
      {/* Collapsible main header for the entire tool executions section */}
      <button
        type="button"
        onClick={() => setIsSectionOpen((prev) => !prev)}
        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground uppercase tracking-wider px-1 py-1 cursor-pointer select-none transition-colors group"
        title={
          isSectionOpen ? "Collapse tool executions" : "Expand tool executions"
        }
      >
        <ChevronRight
          className={`size-3.5 transition-transform duration-200 text-muted-foreground group-hover:text-foreground ${
            isSectionOpen ? "rotate-90" : "rotate-0"
          }`}
        />
        <span>Tool executions ({toolCalls.length})</span>
      </button>

      {/* Smoothly animated collapsible list */}
      <div
        className={`grid transition-all duration-200 ease-in-out ${
          isSectionOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden space-y-1 pt-0.5">
          {toolCalls.map((tc) => (
            <ToolCallItem key={tc.id} toolCall={tc} />
          ))}
        </div>
      </div>
    </div>
  );
}
