import "./App.css";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/Chat/ChatArea";
import SettingsModal from "./components/SettingsModal";
import AddProjectModal from "./components/AddProjectModal";
import DeleteProjectModal from "./components/DeleteProjectModal";
import DeleteSessionModal from "./components/DeleteSessionModal";
import { Toaster } from "./components/Toaster";
import { useSSE } from "./shared/hooks/useSee";

function SessionRedirect() {
  const { sessionId } = useParams<{ sessionId?: string }>();
  return <Navigate to={sessionId ? `/sessions/${sessionId}` : "/"} replace />;
}

export default function App() {
  useSSE();

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar />
      <Routes>
        <Route path="/" element={<ChatArea />} />
        <Route path="/sessions/:sessionId" element={<ChatArea />} />
        <Route path="/session/:sessionId" element={<SessionRedirect />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <SettingsModal />
      <AddProjectModal />
      <DeleteProjectModal />
      <DeleteSessionModal />
      <Toaster />
    </div>
  );
}
