import type { ConversationTurn } from "../../store/types";
import ToolCallsAccordion from "../ToolCallsAccordion";
import MarkdownRenderer from "../MarkdownRenderer";

interface TurnItemProps {
  turn: ConversationTurn;
}

export default function TurnItem({ turn }: TurnItemProps) {
  return (
    <div className="space-y-4">
      {/* 1. User message */}
      <div className="rounded-2xl border border-border bg-popover text-popover-foreground p-3 sm:p-4 text-sm shadow-xs">
        <p className="whitespace-pre-wrap leading-relaxed">{turn.userMessage}</p>
      </div>

      {/* 2. Tool calls accordion */}
      {turn.toolCalls && turn.toolCalls.length > 0 && (
        <ToolCallsAccordion toolCalls={turn.toolCalls} />
      )}

      {/* 3. AI response */}
      <div className="px-1 text-sm text-foreground">
        <MarkdownRenderer content={turn.aiMessage || turn.aiResponse || ""} />
      </div>
    </div>
  );
}
