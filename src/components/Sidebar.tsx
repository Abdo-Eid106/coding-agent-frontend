import { useState } from "react";
import { Plus, Filter, FolderPlus, Settings } from "lucide-react";
import ProjectItem from "./ProjectItem";
import NewProjectDialog from "./NewProjectDialog";
import type { Project } from "../store/types";

interface SidebarProps {
  isOpen: boolean;
  projects: Project[];
  activeSessionId: string | null;
  onToggleProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onAddProject: (name: string, directory: string) => void;
  onAddSession: (projectId: string, name: string) => void;
  onSelectSession: (sessionId: string) => void;
  onNewConversation: () => void;
}

export default function Sidebar({
  isOpen,
  projects,
  activeSessionId,
  onToggleProject,
  onDeleteProject,
  onAddProject,
  onAddSession,
  onSelectSession,
  onNewConversation,
}: SidebarProps) {
  const [showNewProject, setShowNewProject] = useState(false);

  return (
    <>
      <aside
        className={`flex flex-col h-screen bg-sidebar border-r border-border transition-all duration-300 ease-in-out ${
          isOpen ? "w-60 min-w-60" : "w-0 min-w-0 overflow-hidden"
        }`}
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {/* Top section: Logo + New Conversation */}
        <div className="p-3 space-y-2">
          {/* New Conversation button */}
          <button
            onClick={onNewConversation}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
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
            <div className="flex items-center gap-0.5">
              <button
                className="p-1 rounded hover:bg-accent transition-colors"
                title="Filter projects"
              >
                <Filter className="size-3.5 text-muted-foreground" />
              </button>
              <button
                className="p-1 rounded hover:bg-accent transition-colors"
                title="New project"
                onClick={() => setShowNewProject(true)}
              >
                <FolderPlus className="size-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Project list */}
          <div className="space-y-0.5">
            {projects.map((project) => (
              <ProjectItem
                key={project.id}
                project={project}
                activeSessionId={activeSessionId}
                onToggle={onToggleProject}
                onDelete={onDeleteProject}
                onAddSession={onAddSession}
                onSelectSession={onSelectSession}
              />
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div className="p-3 border-t border-border">
          <button className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
            <Settings className="size-4 text-muted-foreground" />
            Settings
          </button>
        </div>
      </aside>

      <NewProjectDialog
        isOpen={showNewProject}
        onClose={() => setShowNewProject(false)}
        onConfirm={onAddProject}
      />
    </>
  );
}
