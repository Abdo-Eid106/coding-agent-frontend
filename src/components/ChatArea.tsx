import { useEffect, useRef } from "react";
import { PanelLeft } from "lucide-react";
import { useUIStore } from "../store/useUIStore";
import { useChatStore } from "../store/useChatStore";
import TurnItem from "./chat/TurnItem";
import ProjectSelector from "./chat/ProjectSelector";
import ChatInput from "./chat/ChatInput";
import ThemeToggle from "./ThemeToggle";

function ChatHeader() {
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <header className="flex items-center justify-between border-b border-border px-3 py-2">
      <button
        type="button"
        onClick={toggleSidebar}
        className="cursor-pointer rounded-md p-1.5 transition-colors hover:bg-accent"
        title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
        aria-label={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
      >
        <PanelLeft className="size-4 text-muted-foreground" />
      </button>

      <ThemeToggle />
    </header>
  );
}

function MessageList() {
  const turns = useChatStore((state) => state.turns);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns]);

  if (turns.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-20 text-sm text-muted-foreground">
        Start a new conversation by typing below...
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="mx-auto max-w-3xl space-y-8 pb-4">
        {turns.map((turn) => (
          <TurnItem key={turn.id} turn={turn} />
        ))}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

function ChatComposer({ isNewChat }: { isNewChat: boolean }) {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-3 px-4 pb-4">
      {isNewChat && (
        <div className="flex justify-start">
          <ProjectSelector />
        </div>
      )}

      <ChatInput />
    </div>
  );
}

export default function ChatArea() {
  const turns = useChatStore((state) => state.turns);
  const isNewChat = turns.length === 0;

  return (
    <main className="flex h-screen flex-1 flex-col bg-background">
      <ChatHeader />
      <MessageList />
      <ChatComposer isNewChat={isNewChat} />
    </main>
  );
}
