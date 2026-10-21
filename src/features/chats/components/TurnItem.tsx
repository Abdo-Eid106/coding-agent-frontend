import remarkGfm from "remark-gfm";
import { Accordion } from "../../tools/components/AccordionItem";
import CopyButton from "../../tools/components/CopyButton";
import ToolCall from "../../tools/components/ToolCall";
import rehypeHighlight from "rehype-highlight";
import ReactMarkdown from "react-markdown";
import type { MessageDto } from "../types";

export default function TurnItem({ message }: { message: MessageDto }) {
  const replies = message.replies ?? [];

  return (
    <div className="space-y-4">
      {/* 1. Main user message */}
      <div className="flex flex-col items-end group">
        <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl border border-border bg-popover text-popover-foreground p-3 sm:p-4 text-sm shadow-xs min-w-0">
          <p className="whitespace-pre-wrap leading-relaxed wrap-break-word break-all">
            {message.content}
          </p>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity pt-1 pr-1 flex justify-end">
          <CopyButton text={message.content} label="message" />
        </div>
      </div>

      <Accordion>
        {(message.toolCalls ?? []).map((toolCall) => (
          <ToolCall key={toolCall.id} toolCall={toolCall} />
        ))}
        <div></div>
      </Accordion>

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
