import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateSession } from "../../../sessions/hooks/session.queries";
import { useProjectStore } from "../../../projects/hooks/useProjectStore";
import { useModelStore } from "@/features/providers/hooks/useModelStore";
import { toast } from "sonner";
import { getErrorMessage } from "@/shared/lib/get-error-message";
import ChatInputBase from "./Base";

export default function CreateSessionInput() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const selectedModelId = useModelStore((state) => state.getSelectedModel());
  const selectedProjectId = useProjectStore((state) => state.selectedProjectId);

  const { mutate, isPending } = useCreateSession();

  const handleSend = () => {
    const messageContent = message.trim();
    if (!messageContent || isPending || !selectedModelId) return;

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
        onError: (error) => {
          toast.error(getErrorMessage(error));
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
