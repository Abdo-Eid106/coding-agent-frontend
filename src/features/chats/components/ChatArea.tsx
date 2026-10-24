import { useParams } from "react-router-dom";
import ChatHeader from "./ChatHeader";
import MessagesList from "./MesasgesList";
import ChatInput from "./ChatInput";
import ProjectSelector from "../../projects/components/ProjectSelector";

export default function ChatArea() {
  const { sessionId } = useParams<{ sessionId?: string }>();

  return (
    <div className="flex h-full flex-1 flex-col bg-background min-w-0 overflow-hidden relative">
      <ChatHeader />
      <MessagesList sessionId={sessionId} />
      <div className="w-full px-3 sm:px-4 pb-3 sm:pb-4 min-w-0">
        <div className="mx-auto max-w-3xl space-y-3 w-full min-w-0">
          {!sessionId && (
            <div className="flex justify-start">
              <ProjectSelector />
            </div>
          )}
          <ChatInput />
        </div>
      </div>
    </div>
  );
}
