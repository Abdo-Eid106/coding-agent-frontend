import { useState, useCallback } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import { useProjectStore } from "./store/useProjectStore";
import { INITIAL_TURNS } from "./store/initialTurns";
import type { ConversationTurn } from "./store/types";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );
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
    const newTurn: ConversationTurn = {
      id: crypto.randomUUID(),
      userMessage: userText,
      toolCalls: [
        {
          id: crypto.randomUUID(),
          tool: "run_command",
          summary: "inspect workspace context",
          output: `Inspecting directory...\nLoaded model: ${model}\nContext refreshed successfully.`,
          duration: "0.3s",
          status: "success",
        },
        {
          id: crypto.randomUUID(),
          tool: "view_file",
          summary: "src/App.tsx",
          output: "Read 60 lines of src/App.tsx.\nState verified.",
          duration: "0.2s",
          status: "success",
        },
        {
          id: crypto.randomUUID(),
          tool: "replace_file_content",
          summary: "src/App.tsx",
          filePath: "src/App.tsx",
          output: "Applied modifications to handle user prompt.",
          diff: `--- a/src/App.tsx
+++ b/src/App.tsx
@@ -42,4 +42,8 @@
   // Processing user instruction
+  const taskResult = "${userText.slice(0, 32)}...";
+  applyUpdates(taskResult);`,
          duration: "0.4s",
          status: "success",
        },
      ],
      aiResponse: `I received your prompt:

> "${userText}"

### Agent Plan & Status
1. **Model**: \`${model}\`
2. **Analysis**: Completed tool inspection of local files.
3. **Execution**: Ready for next actions or modifications.`,
      timestamp: "Just now",
    };

    setTurns((prev) => [...prev, newTurn]);
  }, []);

  return (
    <div className="">
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
      </div>
    </div>
  );
}

export default App;
