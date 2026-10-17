import { useParams } from "react-router-dom";
import CreateSessionInput from "./CreateSessionInput";
import AddMessageInput from "./AddMessageInput";

export default function ChatInput() {
  const { sessionId } = useParams<{ sessionId?: string }>();
  return sessionId == undefined ? <CreateSessionInput /> : <AddMessageInput />;
}
