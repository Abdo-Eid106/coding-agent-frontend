import { useRef, useState } from "react";
import { Plus, Send, Loader2 } from "lucide-react";
import ModelSelector from "./ModelSelector";
import { useChatStore } from "../../store/useChatStore";
import { useProjectStore } from "../../store/useProjectStore";
import { useCreateSession } from "../../queries/session.queries";
import { useAddMessage } from "../../queries/message.queries";

export default function ChatInput() {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentSessionId = useChatStore((s) => s.currentSessionId);
  const selectedModelId = useChatStore((s) => s.selectedModelId);
  const selectedProjectId = useProjectStore((s) => s.selectedProjectId);

  const { mutate: createSession, isPending: isCreating } = useCreateSession();
  const { mutate: addMessage, isPending: isAdding } = useAddMessage(
    currentSessionId ?? undefined
  );

  const isSending = isCreating || isAdding;

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed || isSending) return;

    if (currentSessionId) {
      addMessage({
        sessionId: currentSessionId,
        messageContent: trimmed,
        modelId: selectedModelId,
      });
    } else {
      createSession({
        messageContent: trimmed,
        modelId: selectedModelId,
        projectId: selectedProjectId ?? undefined,
      });
    }

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

          <ModelSelector />
        </div>

        <button
          type="button"
          onClick={handleSend}
          disabled={!message.trim() || isSending}
          className="p-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs flex items-center justify-center"
          title="Send message"
        >
          {isSending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Send className="size-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
