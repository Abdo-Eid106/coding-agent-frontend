import { useState } from "react";
import { FolderOpen, ChevronRight } from "lucide-react";
import { type ProjectDto } from "../../projects/types";
import SessionItem from "./SessionItem";
import ProjectMenu from "../../projects/components/ProjectMenu";
import { useCurrentSessionId } from "../../sessions/hooks/useCurrentSessionId";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { cn } from "cn";

interface ProjectItemProps {
  project: ProjectDto;
}

export default function ProjectItem({ project }: ProjectItemProps) {
  const sessionId = useCurrentSessionId();

  // Directly access the sessions populated inside the project
  const projectSessions = project.sessions ?? [];

  const containsOpenedSession = Boolean(
    sessionId && projectSessions.some((s) => s.id === sessionId),
  );

  const [isOpen, setIsOpen] = useState(containsOpenedSession);
  const [prevContainsOpenedSession, setPrevContainsOpenedSession] = useState(
    containsOpenedSession,
  );
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

  const handleToggleSelect = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <SidebarMenuItem className="select-none">
      <SidebarMenuButton
        onClick={handleToggleSelect}
        className="h-8 cursor-pointer select-none pr-16"
      >
        <ChevronRight
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ease-in-out",
            isOpen && "rotate-90",
          )}
        />
        <FolderOpen className="size-4 shrink-0 text-muted-foreground" />
        <span className="truncate font-medium">{project.name}</span>
      </SidebarMenuButton>

      <div className="absolute right-1 top-1.5 flex items-center gap-1">
        <ProjectMenu projectId={project.id} projectName={project.name} />
      </div>

      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-200 ease-in-out",
          isOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0 pointer-events-none",
        )}
      >
        <div className="overflow-hidden">
          <SidebarMenuSub className="gap-0.5">
            {projectSessions.length === 0 ? (
              <div className="py-1 px-2 text-xs text-muted-foreground italic">
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
          </SidebarMenuSub>
        </div>
      </div>
    </SidebarMenuItem>
  );
}
