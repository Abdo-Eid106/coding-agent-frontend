import { FolderOpen, ChevronDown, ChevronRight } from "lucide-react";
import type { Project } from "../store/types";
import SessionItem from "./sidebar/SessionItem";
import ProjectMenu from "./sidebar/ProjectMenu";

interface ProjectItemProps {
  project: Project;
  activeSessionId: string | null;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAddSession: (projectId: string, name: string) => void;
  onSelectSession: (sessionId: string) => void;
}

export default function ProjectItem({
  project,
  activeSessionId,
  onToggle,
  onDelete,
  onAddSession,
  onSelectSession,
}: ProjectItemProps) {
  const ChevronIcon = project.isExpanded ? ChevronDown : ChevronRight;

  return (
    <div className="select-none">
      {/* Project header row */}
      <div className="group flex items-center gap-1 px-2 py-1.5 rounded-md hover:bg-sidebar-accent cursor-pointer text-sidebar-foreground">
        <button
          onClick={() => onToggle(project.id)}
          className="flex items-center gap-1.5 flex-1 min-w-0 text-left cursor-pointer"
        >
          <ChevronIcon className="size-3.5 shrink-0 text-muted-foreground" />
          <FolderOpen className="size-4 shrink-0 text-muted-foreground" />
          <span className="text-sm truncate">{project.name}</span>
        </button>

        <ProjectMenu
          projectId={project.id}
          onAddSession={onAddSession}
          onDelete={onDelete}
        />
      </div>

      {/* Collapsible sessions list */}
      <div
        className="overflow-hidden transition-all duration-200"
        style={{
          maxHeight: project.isExpanded ? `${project.sessions.length * 40 + 8}px` : "0px",
          opacity: project.isExpanded ? 1 : 0,
        }}
      >
        <div className="ml-4 pl-3 border-l border-border/50">
          {project.sessions.map((session) => (
            <SessionItem
              key={session.id}
              session={session}
              isActive={activeSessionId === session.id}
              onSelect={onSelectSession}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
