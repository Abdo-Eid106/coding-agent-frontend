import { useState, useRef, useEffect } from "react";
import { PanelLeft, MoreVertical } from "lucide-react";
import type { Project, ConversationTurn } from "../store/types";
import TurnItem from "./chat/TurnItem";
import ProjectSelector from "./chat/ProjectSelector";
import ChatInput from "./chat/ChatInput";

interface ChatAreaProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (projectId: string | null) => void;
  turns: ConversationTurn[];
  onSendMessage: (text: string, model: string) => void;
}

export default function ChatArea({
  isSidebarOpen,
  onToggleSidebar,
  projects,
  selectedProjectId,
  onSelectProject,
  turns,
  onSendMessage,
}: ChatAreaProps) {
  const [selectedModel, setSelectedModel] = useState("Claude Opus 4.6 (Thinking)");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns]);

  return (
    <div className="flex-1 flex flex-col h-screen bg-background">
      {/* Top Header */}
      <header className="flex items-center justify-between px-3 py-2 border-b border-border">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-md hover:bg-accent transition-colors cursor-pointer"
          title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
        >
          <PanelLeft className="size-4 text-muted-foreground" />
        </button>

        <button
          className="p-1.5 rounded-md hover:bg-accent transition-colors cursor-pointer"
          title="More options"
        >
          <MoreVertical className="size-4 text-muted-foreground" />
        </button>
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
          <ProjectSelector
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={onSelectProject}
          />
        </div>

        <ChatInput
          onSendMessage={onSendMessage}
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
        />
      </div>
    </div>
  );
}
