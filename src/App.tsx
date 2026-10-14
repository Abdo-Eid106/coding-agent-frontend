import { useState, useCallback } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import SettingsModal from "./components/SettingsModal";
import { useProjectStore } from "./store/useProjectStore";
import { INITIAL_TURNS } from "./store/initialTurns";
import { createMockTurn } from "./store/mockAgent";
import type { ConversationTurn } from "./store/types";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [turns, setTurns] = useState<ConversationTurn[]>(INITIAL_TURNS);

  const {
    projects,
    activeSessionId,
    toggleProject,
    addProject,
    deleteProject,
    addSession,
    selectSession,
  } = useProjectStore();

  const handleNewConversation = useCallback(() => {
    setTurns([]);
  }, []);

  const handleSendMessage = useCallback((userText: string, model: string) => {
    const newTurn = createMockTurn(userText, model);
    setTurns((prev) => [...prev, newTurn]);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar
        isOpen={sidebarOpen}
        projects={projects}
        activeSessionId={activeSessionId}
        onToggleProject={toggleProject}
        onDeleteProject={deleteProject}
        onAddProject={addProject}
        onAddSession={addSession}
        onSelectSession={selectSession}
        onNewConversation={handleNewConversation}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <ChatArea
        isSidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
        turns={turns}
        onSendMessage={handleSendMessage}
      />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
