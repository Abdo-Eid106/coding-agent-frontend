import type { MessageDto } from "../../queries";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
// import ToolCallsAccordion from "../toolCalls/ToolCallsAccordion";

export default function TurnItem({ message }: { message: MessageDto }) {
  const replies = message.replies ?? [];

  return (
    <div className="space-y-4">
      {/* 1. Main message */}
      <div className="rounded-2xl border border-border bg-popover text-popover-foreground p-3 sm:p-4 text-sm shadow-xs">
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
      </div>

      {/* 2. Tool calls accordion */}
      {/* {turn.toolCalls && turn.toolCalls.length > 0 && (
        <ToolCallsAccordion toolCalls={turn.toolCalls} />
      )} */}

      {/* 2. Replies (AI responses) */}
      {replies.map((reply) => (
        <div key={reply.id} className="px-1 text-sm text-foreground">
          <div className="ai-message prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[[rehypeHighlight, { detect: true }]]}
            >
              {reply.content}
            </ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
}
