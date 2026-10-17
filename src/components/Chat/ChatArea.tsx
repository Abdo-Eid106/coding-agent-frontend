import { useParams } from "react-router-dom";
import { useUIStore } from "../../store/useUIStore";
import { PanelLeft } from "lucide-react";
import { useFetchMessages } from "../../queries/test-messages.queries";
import ThemeToggle from "../ThemeToggle";
import TurnItem from "./TurnItem";
import ProjectSelector from "./ProjectSelector";
import { useEffect, useRef } from "react";
import ChatInput from "./ChatInput";

function ChatHeader() {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const sessionTitle = "title";

  return (
    <header className="flex items-center justify-between border-b border-border px-3 py-2">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={toggleSidebar}
          className="cursor-pointer rounded-md p-1.5 transition-colors hover:bg-accent"
        >
          <PanelLeft className="size-4 text-muted-foreground" />
        </button>

        {sessionTitle && (
          <span className="max-w-xs truncate text-xs font-medium text-foreground sm:max-w-md">
            {sessionTitle}
          </span>
        )}
      </div>
      <ThemeToggle />
    </header>
  );
}

function MessageList() {
  const { sessionId } = useParams<{ sessionId?: string }>();
  const { data } = useFetchMessages(sessionId);

  const messages = data?.pages.toReversed().flatMap((page) => page.items) ?? [];
  const lastMessageId = messages[messages.length - 1]?.id;
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages.length, lastMessageId]);

  if (!sessionId) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-20 text-sm text-muted-foreground">
        Start a new conversation by typing below...
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="mx-auto max-w-3xl space-y-8 pb-4">
        {messages.map((message) => (
          <TurnItem key={message.id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export default function ChatArea() {
  const { sessionId } = useParams<{ sessionId?: string }>();

  return (
    <main className="flex h-screen flex-1 flex-col bg-background">
      <ChatHeader />
      <MessageList />
      <div className="mx-auto w-full max-w-3xl space-y-3 px-4 pb-4">
        {!sessionId && (
          <div className="flex justify-start">
            <ProjectSelector />
          </div>
        )}
        <ChatInput />
      </div>
    </main>
  );
}
