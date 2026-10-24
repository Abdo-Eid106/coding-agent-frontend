import type { KeyboardEvent } from "react";
import { CircleStop, Send } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";

import ModelSelector from "../../../providers/components/ModelSelector";

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
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter" || e.shiftKey || e.nativeEvent.isComposing) return;

    e.preventDefault();
    if (!isPending && message.trim()) onSend();
  };

  const handleAction = () => (isPending ? onStop?.() : onSend());

  return (
    <InputGroup className="shadow-none ring-0 focus-within:ring-0">
      <InputGroupTextarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={"Type your message…"}
        rows={1}
        className="max-h-60 min-h-10"
      />

      <InputGroupAddon align="block-end">
        <ModelSelector />

        <InputGroupButton
          variant="default"
          size="icon-sm"
          className="ml-auto rounded-full"
          onClick={handleAction}
          disabled={!isPending && !message.trim()}
          aria-label={isPending ? "Stop generating" : "Send message"}
        >
          {isPending ? <CircleStop /> : <Send />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
