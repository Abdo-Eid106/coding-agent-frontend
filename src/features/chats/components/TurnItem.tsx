import remarkGfm from "remark-gfm";
import { Accordion } from "../../tools/components/AccordionItem";
import CopyButton from "../../tools/components/CopyButton";
import ToolCall from "../../tools/components/ToolCall";
import rehypeHighlight from "rehype-highlight";
import ReactMarkdown from "react-markdown";
import type { MessageDto } from "../types";

import { useRef, useState, type ComponentPropsWithoutRef } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "../../../shared/lib/cn";

export default function TurnItem({ message }: { message: MessageDto }) {
  const replies = message.replies ?? [];

  return (
    <div className="space-y-4 w-full min-w-0">
      {/* 1. Main user message */}
      <div className="flex flex-col items-end group w-full min-w-0">
        <div className="max-w-[92%] sm:max-w-[85%] md:max-w-[75%] rounded-2xl border border-border bg-popover text-popover-foreground p-3 sm:p-4 text-sm shadow-xs min-w-0">
          <p className="whitespace-pre-wrap leading-relaxed wrap-anywhere">
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
      </Accordion>

      {/* 2. Replies (AI responses) */}
      {replies.map((reply) => (
        <div
          key={reply.id}
          className="px-1 text-sm text-foreground w-full min-w-0 overflow-hidden"
        >
          <div
            className="ai-message prose prose-sm dark:prose-invert max-w-none min-w-0 wrap-anywhere
                 prose-code:before:content-none prose-code:after:content-none
                 prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5
                 prose-code:font-mono prose-code:font-normal"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                pre: CodeBlock,
              }}
            >
              {reply.content.replace(/\\`/g, "`")}
            </ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
}

function CodeBlock({ children, ...props }: ComponentPropsWithoutRef<"pre">) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = preRef.current?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative group not-prose my-2 max-w-full min-w-0 overflow-hidden rounded-md border border-border/50">
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy code"
        className={cn(
          "absolute right-2 top-2 z-10 flex items-center gap-1",
          "rounded border bg-background/80 px-1.5 py-0.5 text-[10px] text-muted-foreground opacity-0 backdrop-blur transition-opacity",
          "hover:text-foreground group-hover:opacity-100 focus:opacity-100",
        )}
      >
        {copied ? (
          <Check size={12} />
        ) : (
          <Copy size={12} className="cursor-pointer" />
        )}
        {copied ? "Copied" : "Copy"}
      </button>
      <pre
        ref={preRef}
        {...props}
        className="max-h-125 w-full overflow-x-auto p-3 text-xs leading-snug"
      >
        {children}
      </pre>
    </div>
  );
}
