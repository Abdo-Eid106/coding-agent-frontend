import { useState } from "react";
import { useParams } from "react-router-dom";
import { v7 as uuidv7 } from "uuid";
import { useAddMessage } from "../../../queries/messages.queries";
import { useChatStore } from "../../../store/useChatStore";
import ChatInputBase from "./Base";

export default function AddMessageInput() {
  const { sessionId } = useParams<{ sessionId: string }>();

  const [message, setMessage] = useState("");
  const selectedModelId = useChatStore((state) => state.selectedModelId);
  const isAgentRunning = useChatStore((state) => state.isAgentRunning);
  const setIsAgentRunning = useChatStore((state) => state.setIsAgentRunning);

  const { mutate, isPending } = useAddMessage(sessionId!);

  const isRunning = isPending || isAgentRunning;

  const handleStop = () => {
    setIsAgentRunning(false);
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
      isPending={isRunning}
      onStop={handleStop}
    />
  );
}
