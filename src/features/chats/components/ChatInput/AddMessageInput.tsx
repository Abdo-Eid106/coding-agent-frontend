import { useState } from "react";
import { useParams } from "react-router-dom";
import { v7 as uuidv7 } from "uuid";
import { useAddMessage } from "../../hooks/useMessages";
import { useChatStore } from "../../hooks/useChatStore";
import {
  useActiveSessions,
  useStopSession,
} from "../../../sessions/hooks/session.queries";
import ChatInputBase from "./Base";

interface AddMessageInputProps {
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export default function AddMessageInput({
  disabled,
  placeholder,
  className,
}: AddMessageInputProps = {}) {
  const { sessionId } = useParams<{ sessionId: string }>();

  const [message, setMessage] = useState("");
  const selectedModelId = useChatStore((state) => state.selectedModelId);

  const { mutate, isPending: isSending } = useAddMessage(sessionId!);
  const { isActive } = useActiveSessions();
  const { mutate: stopSession, isPending: isStopping } = useStopSession();

  const isRunning = (sessionId ? isActive(sessionId) : false) || isSending;

  const handleStop = () => {
    if (sessionId) {
      stopSession(sessionId);
    }
  };

  const handleSend = () => {
    const messageContent = message.trim();
    if (!messageContent || isRunning) return;
    setMessage("");

    mutate(
      {
        messageId: uuidv7(),
        messageContent,
        modelId: selectedModelId,
      },
      {
        onError: () => {
          setMessage(messageContent);
        },
      },
    );
  };

  return (
    <ChatInputBase
      message={message}
      setMessage={setMessage}
      onSend={handleSend}
      isPending={isRunning || isStopping}
      onStop={handleStop}
      disabled={disabled}
      placeholder={placeholder}
      className={className}
    />
  );
}
