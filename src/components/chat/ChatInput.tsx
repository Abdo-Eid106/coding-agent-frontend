import { useRef, useState } from "react";
import { Plus, Send } from "lucide-react";
import ModelSelector from "./ModelSelector";
import { useChatStore } from "../../store/useChatStore";

export default function ChatInput() {
  const [message, setMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState("Claude Opus 4.6 (Thinking)");
  const sendMessage = useChatStore((s) => s.sendMessage);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    sendMessage(trimmed, selectedModel);
    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  return (
    <div className="rounded-xl border border-border bg-popover text-popover-foreground shadow-xs">
      {/* Text input */}
      <div className="px-4 pt-3 pb-2">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type your message…"
          rows={1}
          className="w-full resize-none bg-transparent text-foreground text-sm placeholder:text-muted-foreground focus:outline-none"
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
          }}
        />
      </div>

      {/* Bottom toolbar */}
      <div className="flex items-center justify-between px-3 pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-1 rounded hover:bg-accent transition-colors cursor-pointer"
            title="Attach file"
          >
            <Plus className="size-4 text-muted-foreground" />
          </button>

          <ModelSelector
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
          />

          <span className="text-xs text-muted-foreground/60 select-none">•</span>

          <span className="text-xs text-muted-foreground px-2 py-0.5 rounded bg-muted/50 border border-border/50">
            Local
          </span>
        </div>

        <button
          type="button"
          onClick={handleSend}
          disabled={!message.trim()}
          className="p-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
          title="Send message"
        >
          <Send className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
