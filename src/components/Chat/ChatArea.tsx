import { useParams } from "react-router-dom";
import ChatHeader from "./ChatHeader";
import MessagesList from "./MesasgesList";
import ChatInput from "./ChatInput";
import ProjectSelector from "./ProjectSelector";

export default function ChatArea() {
  const { sessionId } = useParams<{ sessionId?: string }>();

  return (
    <main className="flex h-screen flex-1 flex-col bg-background">
      <ChatHeader />
      <MessagesList sessionId={sessionId} />
      <div className="w-full px-4 pb-4">
        <div className="mx-auto max-w-3xl space-y-3">
          {!sessionId && (
            <div className="flex justify-start">
              <ProjectSelector />
            </div>
          )}
          <ChatInput />
        </div>
      </div>
    </main>
  );
}
