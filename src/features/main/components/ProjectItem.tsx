import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FolderOpen, ChevronDown, ChevronRight } from "lucide-react";
import { type ProjectDto } from "../../projects/types";
import SessionItem from "./SessionItem";
import ProjectMenu from "../../projects/components/ProjectMenu";

interface ProjectItemProps {
  project: ProjectDto;
}

export default function ProjectItem({ project }: ProjectItemProps) {
  const { sessionId } = useParams<{ sessionId?: string }>();

  // Directly access the sessions populated inside the project
  const projectSessions = project.sessions ?? [];

  const [isOpen, setIsOpen] = useState(() =>
    Boolean(sessionId && project.sessions?.some((s) => s.id === sessionId))
  );

  const ChevronIcon = isOpen ? ChevronDown : ChevronRight;

  // Auto-expand if the active session belongs to this project
  useEffect(() => {
    if (sessionId && project.sessions?.some((s) => s.id === sessionId)) {
      setIsOpen(true);
    }
  }, [sessionId, project.sessions]);

  const handleToggleSelect = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="select-none">
      {/* Project header row */}
      <div
        onClick={handleToggleSelect}
        className="group flex items-center justify-between gap-2.5 w-full h-8 px-3 rounded-lg font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5 flex-1 min-w-0 text-left">
          <ChevronIcon className="size-3.5 shrink-0" />
          <FolderOpen className="size-4 shrink-0" />
          <span className="truncate">{project.name}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          {projectSessions.length > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border shrink-0">
              {projectSessions.length}
            </span>
          )}
          <ProjectMenu projectId={project.id} projectName={project.name} />
        </div>
      </div>

      {/* Collapsible sessions list */}
      <div
        className="overflow-hidden transition-all duration-200"
        style={{
          maxHeight: isOpen
            ? `${Math.max(projectSessions.length, 1) * 48 + 16}px`
            : "0px",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="ml-3 pl-2.5 border-l border-border/50 py-1 space-y-1">
          {projectSessions.length === 0 ? (
            <div className="py-1 px-3 text-muted-foreground italic">
              No sessions yet
            </div>
          ) : (
            projectSessions.map((session) => (
              <SessionItem
                key={session.id}
                session={session}
                projectId={project.id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
