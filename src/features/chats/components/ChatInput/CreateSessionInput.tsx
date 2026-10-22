import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateSession } from "../../../sessions/hooks/session.queries";
import { useChatStore } from "../../hooks/useChatStore";
import { useProjectStore } from "../../../projects/hooks/useProjectStore";
import ChatInputBase from "./Base";

export default function CreateSessionInput() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const selectedModelId = useChatStore((state) => state.selectedModelId);
  const selectedProjectId = useProjectStore((state) => state.selectedProjectId);
  const { mutate, isPending } = useCreateSession();

  const handleSend = () => {
    const messageContent = message.trim();
    if (!messageContent || isPending) return;

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
      },
    );
  };

  return (
    <ChatInputBase
      message={message}
      setMessage={setMessage}
      onSend={handleSend}
      isPending={isPending}
    />
  );
}
