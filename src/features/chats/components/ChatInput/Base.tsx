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
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export default function ChatInputBase({
  message,
  setMessage,
  onSend,
  isPending,
  onStop,
  disabled = false,
  placeholder = "Type your message…",
  className,
}: ChatInputBaseProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter" || e.shiftKey || e.nativeEvent.isComposing) return;

    e.preventDefault();
    if (!disabled && !isPending && message.trim()) onSend();
  };

  const handleAction = () => (isPending ? onStop?.() : onSend());

  return (
    <InputGroup className={className}>
      <InputGroupTextarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
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
          disabled={disabled || (!isPending && !message.trim())}
          aria-label={isPending ? "Stop generating" : "Send message"}
        >
          {isPending ? <CircleStop /> : <Send />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
