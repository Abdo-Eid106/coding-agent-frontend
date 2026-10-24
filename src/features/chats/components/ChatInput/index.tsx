import { useParams } from "react-router-dom";
import CreateSessionInput from "./CreateSessionInput";
import AddMessageInput from "./AddMessageInput";
import { InterruptPanel } from "../InterruptPanel";

export default function ChatInput() {
  const { sessionId } = useParams<{ sessionId?: string }>();

  return (
    <div className="w-full">
      <InterruptPanel />
      {sessionId == undefined ? <CreateSessionInput /> : <AddMessageInput />}
    </div>
  );
}
