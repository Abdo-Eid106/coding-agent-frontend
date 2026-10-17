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
