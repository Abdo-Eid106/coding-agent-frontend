import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { FolderOpen, ChevronDown, ChevronRight } from "lucide-react";
import type { ProjectDto } from "../queries";
import { useProjectStore } from "../store/useProjectStore";
import SessionItem from "./sidebar/SessionItem";
import ProjectMenu from "./sidebar/ProjectMenu";

interface ProjectItemProps {
  project: ProjectDto;
}

export default function ProjectItem({ project }: ProjectItemProps) {
  const selectedProjectId = useProjectStore((s) => s.selectedProjectId);
  const setSelectedProjectId = useProjectStore((s) => s.setSelectedProjectId);
  const { sessionId } = useParams<{ sessionId?: string }>();

  // Directly access the sessions populated inside the project
  const projectSessions = project.sessions ?? [];

  const isSelected = selectedProjectId === project.id;
  const ChevronIcon = isSelected ? ChevronDown : ChevronRight;

  // Auto-expand if the active session belongs to this project
  useEffect(() => {
    if (
      sessionId &&
      project.sessions?.some((s) => s.id === sessionId)
    ) {
      if (!isSelected) {
        setSelectedProjectId(project.id);
      }
    }
  }, [
    sessionId,
    project.sessions,
    isSelected,
    project.id,
    setSelectedProjectId,
  ]);

  const handleToggleSelect = () => {
    setSelectedProjectId(isSelected ? null : project.id);
  };

  return (
    <div className="select-none">
      {/* Project header row */}
      <div
        onClick={handleToggleSelect}
        className="group flex items-center justify-between gap-2.5 w-full px-3 py-2 rounded-lg font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5 flex-1 min-w-0 text-left">
          <ChevronIcon className="size-3.5 shrink-0" />
          <FolderOpen className="size-4 shrink-0" />
          <span className="truncate">{project.name}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          {projectSessions.length > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground border border-border shrink-0">
              {projectSessions.length}
            </span>
          )}
          <div
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <ProjectMenu projectId={project.id} projectName={project.name} />
          </div>
        </div>
      </div>

      {/* Collapsible sessions list */}
      <div
        className="overflow-hidden transition-all duration-200"
        style={{
          maxHeight: isSelected
            ? `${Math.max(projectSessions.length, 1) * 48 + 16}px`
            : "0px",
          opacity: isSelected ? 1 : 0,
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
