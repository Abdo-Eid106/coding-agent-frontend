import { FolderOpen, ChevronDown, ChevronRight } from "lucide-react";
import type { ProjectDto } from "../queries";
import { useProjectStore } from "../store/useProjectStore";
import { useFetchSessions } from "../queries/session.queries";
import SessionItem from "./sidebar/SessionItem";
import ProjectMenu from "./sidebar/ProjectMenu";

interface ProjectItemProps {
  project: ProjectDto;
}

export default function ProjectItem({ project }: ProjectItemProps) {
  const selectedProjectId = useProjectStore((s) => s.selectedProjectId);
  const setSelectedProjectId = useProjectStore((s) => s.setSelectedProjectId);
  const { data: allSessions = [] } = useFetchSessions();

  const isSelected = selectedProjectId === project.id;
  const ChevronIcon = isSelected ? ChevronDown : ChevronRight;

  const projectSessions = allSessions.filter(
    (s) => s.project?.id === project.id
  );

  const handleToggleSelect = () => {
    setSelectedProjectId(isSelected ? null : project.id);
  };

  return (
    <div className="select-none">
      {/* Project header row */}
      <div
        onClick={handleToggleSelect}
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
          <ProjectMenu projectId={project.id} projectName={project.name} />
        </div>
      </div>

      {/* Collapsible sessions list */}
      <div
        className="overflow-hidden transition-all duration-200"
        style={{
          maxHeight: isSelected
            ? `${Math.max(projectSessions.length, 1) * 40 + 8}px`
            : "0px",
          opacity: isSelected ? 1 : 0,
        }}
      >
        <div className="ml-4 pl-3 border-l border-border/50">
          {projectSessions.length === 0 ? (
            <div className="py-1 px-2 text-xs text-muted-foreground italic">
              No sessions yet
            </div>
          ) : (
            projectSessions.map((session) => (
              <SessionItem key={session.id} session={session} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
