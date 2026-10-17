import type { KeyboardEvent } from "react";
import { LoaderCircle, Plus, Send } from "lucide-react";
import ModelSelector from "../ModelSelector";

interface ChatInputBaseProps {
  message: string;
  setMessage: (message: string) => void;
  onSend: () => void;
  isPending: boolean;
}

export default function ChatInputBase({
  message,
  setMessage,
  onSend,
  isPending,
}: ChatInputBaseProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter" || e.shiftKey || e.nativeEvent.isComposing) {
      return;
    }

    e.preventDefault();
    onSend();
  };

  return (
    <div className="rounded-xl border border-border bg-popover text-popover-foreground shadow-xs">
      <div className="px-4 pt-3 pb-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message…"
          rows={1}
          className="w-full resize-none bg-transparent text-foreground text-sm placeholder:text-muted-foreground focus:outline-none"
        />
      </div>

      <div className="flex items-center justify-between px-3 pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="cursor-pointer rounded p-1 transition-colors hover:bg-accent"
            title="Attach file"
          >
            <Plus className="size-4 text-muted-foreground" />
          </button>

          <ModelSelector />
        </div>

        <button
          type="button"
          onClick={onSend}
          disabled={!message.trim() || isPending}
          className="flex cursor-pointer items-center justify-center rounded-lg bg-primary p-1.5 text-primary-foreground shadow-xs transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
          title="Send message"
        >
          {isPending ? (
            <LoaderCircle className="size-3.5 animate-spin" />
          ) : (
            <Send className="size-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
