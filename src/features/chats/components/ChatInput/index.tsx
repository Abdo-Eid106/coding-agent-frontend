import { useParams } from "react-router-dom";
import CreateSessionInput from "./CreateSessionInput";
import AddMessageInput from "./AddMessageInput";
import { InterruptPanel } from "../InterruptPanel";
import { useFetchMessages } from "../../hooks/useMessages";

export default function ChatInput() {
  const { sessionId } = useParams<{ sessionId?: string }>();

  const { data: messages, isLoading } = useFetchMessages(sessionId);
  if (!messages || isLoading) return;

  const lastMessage = messages.at(-1);

  return (
    <div className="w-full">
      {lastMessage && <InterruptPanel messageId={lastMessage.id} />}
      {sessionId == undefined ? <CreateSessionInput /> : <AddMessageInput />}
    </div>
  );
}
