import "./App.css";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import Sidebar from "./features/main/components/Sidebar";
import ChatArea from "./features/chats/components/ChatArea";
import SettingsModal from "./features/settings/components/SettingsModal";
import AddProjectModal from "./features/projects/components/AddProjectModal";
import DeleteProjectModal from "./features/projects/components/DeleteProjectModal";
import DeleteSessionModal from "./features/sessions/components/DeleteSessionModal";
import { Toaster } from "./features/main/components/Toaster";
import { useSSE } from "./shared/hooks/useSee";

import { SidebarProvider, SidebarInset } from "./components/ui/sidebar";

function SessionRedirect() {
  const { sessionId } = useParams<{ sessionId?: string }>();
  return <Navigate to={sessionId ? `/sessions/${sessionId}` : "/"} replace />;
}

export default function App() {
  useSSE();

  return (
    <SidebarProvider className="h-screen w-full overflow-hidden bg-background text-foreground">
      <Sidebar />
      <SidebarInset className="h-screen overflow-hidden">
        <Routes>
          <Route path="/" element={<ChatArea />} />
          <Route path="/sessions/:sessionId" element={<ChatArea />} />
          <Route path="/session/:sessionId" element={<SessionRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SidebarInset>
      <SettingsModal />
      <AddProjectModal />
      <DeleteProjectModal />
      <DeleteSessionModal />
      <Toaster />
    </SidebarProvider>
  );
}
