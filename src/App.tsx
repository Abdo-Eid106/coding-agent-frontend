import "./App.css";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import SettingsModal from "./components/SettingsModal";
import AddProjectModal from "./components/AddProjectModal";
import DeleteProjectModal from "./components/DeleteProjectModal";
import DeleteSessionModal from "./components/DeleteSessionModal";
import { Toaster } from "./components/Toaster";

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar />
      <ChatArea />
      <SettingsModal />
      <AddProjectModal />
      <DeleteProjectModal />
      <DeleteSessionModal />
      <Toaster />
    </div>
  );
}
