import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateSession } from "../../../queries";
import { useChatStore } from "../../../store/useChatStore";
import ChatInputBase from "./Base";
import { useProjectStore } from "../../../store/useProjectStore";

export default function CreateSessionInput() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const selectedModelId = useChatStore((state) => state.selectedModelId);
  const selectedProjectId = useProjectStore((state) => state.selectedProjectId);
  const isAgentRunning = useChatStore((state) => state.isAgentRunning);
  const setIsAgentRunning = useChatStore((state) => state.setIsAgentRunning);

  const { mutate, isPending } = useCreateSession();

  const isRunning = isPending || isAgentRunning;

  const handleStop = () => {
    setIsAgentRunning(false);
  };

  const handleSend = () => {
    const messageContent = message.trim();
    if (!messageContent || isRunning) return;

    setIsAgentRunning(true);
    mutate(
      {
        messageContent,
        modelId: selectedModelId,
        projectId: selectedProjectId ?? undefined,
      },
      {
        onSuccess: (session) => {
          setMessage("");
          navigate(`/sessions/${session.id}`);
        },
        onError: () => {
          setIsAgentRunning(false);
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
