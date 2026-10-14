import { Plus, Settings } from "lucide-react";
import ProjectItem from "./ProjectItem";
import AddProjectButton from "./sidebar/AddProjectButton";
import { useProjectStore } from "../store/useProjectStore";
import { useUIStore } from "../store/useUIStore";
import { useChatStore } from "../store/useChatStore";

export default function Sidebar() {
  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);
  const openSettings = useUIStore((s) => s.openSettings);
  const newConversation = useChatStore((s) => s.newConversation);
  const projects = useProjectStore((s) => s.projects);

  return (
    <aside
      className={`flex flex-col h-screen bg-sidebar border-r border-border transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "w-60 min-w-60" : "w-0 min-w-0 overflow-hidden"
      }`}
      style={{
        transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
      }}
    >
      {/* Top section: Logo + New Conversation */}
      <div className="p-3 space-y-2">
        {/* New Conversation button */}
        <button
          onClick={newConversation}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer text-nowrap"
        >
          <Plus className="size-4" />
          New Conversation
        </button>
      </div>

      {/* Projects section */}
      <div className="flex-1 overflow-y-auto px-3">
        <div className="flex items-center justify-between mb-2 mt-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Projects
          </span>
          <AddProjectButton />
        </div>

        {/* Project list */}
        <div className="space-y-0.5">
          {projects.map((project) => (
            <ProjectItem key={project.id} project={project} />
          ))}
        </div>
      </div>

      {/* Bottom section */}
      <div className="p-3 border-t border-border">
        <button
          onClick={openSettings}
          className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer"
        >
          <Settings className="size-4 text-muted-foreground" />
          Settings
        </button>
      </div>
    </aside>
  );
}
