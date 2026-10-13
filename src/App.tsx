import { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import { useProjectStore } from "./store/useProjectStore";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );
  const {
    projects,
    activeSessionId,
    toggleProject,
    addProject,
    deleteProject,
    addSession,
    selectSession,
  } = useProjectStore();

  return (
    <div className="dark">
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
          onNewConversation={() => {
            /* TODO: handle new conversation */
          }}
        />
        <ChatArea
          isSidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSelectProject={setSelectedProjectId}
        />
      </div>
    </div>
  );
}

export default App;
