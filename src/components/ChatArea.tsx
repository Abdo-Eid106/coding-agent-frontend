import { useRef, useEffect } from "react";
import { PanelLeft } from "lucide-react";
import { useUIStore } from "../store/useUIStore";
import { useChatStore } from "../store/useChatStore";
import TurnItem from "./chat/TurnItem";
import ProjectSelector from "./chat/ProjectSelector";
import ChatInput from "./chat/ChatInput";
import ThemeToggle from "./ThemeToggle";

export default function ChatArea() {
  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const turns = useChatStore((s) => s.turns);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns]);

  return (
    <div className="flex-1 flex flex-col h-screen bg-background">
      {/* Top Header */}
      <header className="flex items-center justify-between px-3 py-2 border-b border-border">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-md hover:bg-accent transition-colors cursor-pointer"
          title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
        >
          <PanelLeft className="size-4 text-muted-foreground" />
        </button>

        <ThemeToggle />
      </header>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-8 pb-4">
          {turns.length === 0 ? (
            <div className="h-full flex items-center justify-center py-20 text-muted-foreground text-sm">
              Start a new conversation by typing below...
            </div>
          ) : (
            turns.map((turn) => <TurnItem key={turn.id} turn={turn} />)
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Bottom Input Area */}
      <div className="max-w-3xl mx-auto w-full px-4 pb-4 space-y-3">
        <div className="flex justify-start">
          <ProjectSelector />
        </div>

        <ChatInput />
      </div>
    </div>
  );
}
