import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { Send, Square, Eye, PenLine } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import ModelSelector from "../ModelSelector";

interface ChatInputBaseProps {
  message: string;
  setMessage: (message: string) => void;
  onSend: () => void;
  isPending: boolean;
  onStop?: () => void;
}

export default function ChatInputBase({
  message,
  setMessage,
  onSend,
  isPending,
  onStop,
}: ChatInputBaseProps) {
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea to fit content up to a max height
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea || isPreview) return;

    textarea.style.height = "auto";
    const newHeight = Math.min(Math.max(textarea.scrollHeight, 40), 240);
    textarea.style.height = `${newHeight}px`;
  }, [message, isPreview]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter" || e.shiftKey || e.nativeEvent.isComposing) {
      return;
    }

    e.preventDefault();
    if (!isPending) {
      onSend();
    }
  };

  const handleActionClick = () => {
    if (isPending) {
      onStop?.();
    } else {
      onSend();
    }
  };

  return (
    <div className="rounded-xl border border-border bg-popover text-popover-foreground shadow-xs">
      <div className="px-4 pt-3 pb-2">
        {isPreview ? (
          <div className="w-full min-h-10 max-h-60 overflow-y-auto text-sm text-foreground prose prose-sm dark:prose-invert max-w-none wrap-break-word break-all">
            {message.trim() ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[[rehypeHighlight, { detect: true }]]}
              >
                {message}
              </ReactMarkdown>
            ) : (
              <p className="text-muted-foreground italic text-xs">
                Nothing to preview
              </p>
            )}
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message… (Markdown supported)"
            rows={1}
            className="w-full resize-none bg-transparent text-foreground text-sm placeholder:text-muted-foreground focus:outline-none min-h-10 max-h-60 overflow-y-auto leading-relaxed"
          />
        )}
      </div>

      <div className="flex items-center justify-between px-3 pb-2">
        <div className="flex items-center gap-2">
          <ModelSelector />

          <button
            type="button"
            onClick={() => setIsPreview((prev) => !prev)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              isPreview
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
            title={isPreview ? "Switch to edit" : "Preview markdown"}
          >
            {isPreview ? (
              <>
                <PenLine className="size-3.5 shrink-0" />
                <span>Edit</span>
              </>
            ) : (
              <>
                <Eye className="size-3.5 shrink-0" />
                <span>Preview</span>
              </>
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={handleActionClick}
          disabled={!isPending && !message.trim()}
          className="flex cursor-pointer items-center justify-center rounded-lg bg-primary p-1.5 text-primary-foreground shadow-xs transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
          title={isPending ? "Stop generating" : "Send message"}
        >
          {isPending ? (
            <Square className="size-3.5 fill-current" />
          ) : (
            <Send className="size-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
