import { useState } from "react";
import { FolderOpen, ChevronDown, ChevronRight } from "lucide-react";
import { type ProjectDto } from "../../projects/types";
import SessionItem from "./SessionItem";
import ProjectMenu from "../../projects/components/ProjectMenu";
import { useCurrentSessionId } from "../../sessions/hooks/useCurrentSessionId";

interface ProjectItemProps {
  project: ProjectDto;
}

export default function ProjectItem({ project }: ProjectItemProps) {
  const sessionId = useCurrentSessionId();

  // Directly access the sessions populated inside the project
  const projectSessions = project.sessions ?? [];

  const containsOpenedSession = Boolean(
    sessionId && projectSessions.some((s) => s.id === sessionId)
  );

  const [isOpen, setIsOpen] = useState(containsOpenedSession);
  const [prevContainsOpenedSession, setPrevContainsOpenedSession] =
    useState(containsOpenedSession);
  const [prevSessionId, setPrevSessionId] = useState(sessionId);

  // Auto-expand if the active session belongs to this project (e.g. navigated to it or sessions loaded)
  if (
    containsOpenedSession &&
    (!prevContainsOpenedSession || sessionId !== prevSessionId)
  ) {
    setPrevContainsOpenedSession(containsOpenedSession);
    setPrevSessionId(sessionId);
    setIsOpen(true);
  } else if (
    containsOpenedSession !== prevContainsOpenedSession ||
    sessionId !== prevSessionId
  ) {
    setPrevContainsOpenedSession(containsOpenedSession);
    setPrevSessionId(sessionId);
  }

  const ChevronIcon = isOpen ? ChevronDown : ChevronRight;

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
