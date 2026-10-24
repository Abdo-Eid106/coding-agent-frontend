import { useState } from "react";
import { useParams } from "react-router-dom";
import { v7 as uuidv7 } from "uuid";
import { useAddMessage } from "../../hooks/useMessages";
import {
  useActiveSessions,
  useStopSession,
} from "../../../sessions/hooks/session.queries";
import ChatInputBase from "./Base";
import { useModelStore } from "@/features/providers/hooks/useModelStore";

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
  const selectedModelId = useModelStore((state) =>
    state.getSelectedModel(sessionId),
  );

  const { mutate, isPending } = useAddMessage(sessionId!);
  const { isActive } = useActiveSessions();
  const { mutate: stopSession, isPending: isStopping } = useStopSession();
  const isRunning = isActive(sessionId!);

  const handleSend = () => {
    const messageContent = message.trim();
    if (!messageContent || isRunning || isPending || !selectedModelId) return;
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
      isPending={isRunning || isStopping || isPending}
      onStop={() => stopSession(sessionId!)}
      disabled={disabled}
      placeholder={placeholder}
      className={className}
    />
  );
}
