import { FolderOpen, ChevronDown, ChevronRight } from "lucide-react";
import type { Project } from "../store/types";
import { useProjectStore } from "../store/useProjectStore";
import SessionItem from "./sidebar/SessionItem";
import ProjectMenu from "./sidebar/ProjectMenu";

interface ProjectItemProps {
  project: Project;
}

export default function ProjectItem({ project }: ProjectItemProps) {
  const toggleProject = useProjectStore((s) => s.toggleProject);
  const ChevronIcon = project.isExpanded ? ChevronDown : ChevronRight;

  return (
    <div className="select-none">
      {/* Project header row */}
      <div
        onClick={() => toggleProject(project.id)}
        className="group flex items-center justify-between gap-1 px-2 py-1.5 rounded-md hover:bg-sidebar-accent cursor-pointer text-sidebar-foreground"
      >
        <div className="flex items-center gap-1.5 flex-1 min-w-0 text-left">
          <ChevronIcon className="size-3.5 shrink-0 text-muted-foreground" />
          <FolderOpen className="size-4 shrink-0 text-muted-foreground" />
          <span className="text-sm truncate">{project.name}</span>
        </div>

        <div
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <ProjectMenu projectId={project.id} />
        </div>
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
            <SessionItem key={session.id} session={session} />
          ))}
        </div>
      </div>
    </div>
  );
}
