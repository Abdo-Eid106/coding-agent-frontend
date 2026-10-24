import { useEffect, useState } from "react";
import { FolderOpen, ChevronRight } from "lucide-react";
import { type ProjectDto } from "../types";
import SessionItem from "../../sessions/components/SessionItem";
import ProjectMenu from "./ProjectMenu";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { cn } from "cn";
import { useParams } from "react-router-dom";

interface ProjectItemProps {
  project: ProjectDto;
}

export default function ProjectItem({ project }: ProjectItemProps) {
  const { sessionId } = useParams<{ sessionId?: string }>();

  const sessions = project.sessions ?? [];
  const containsOpenedSession =
    !!sessionId && sessions.some((s) => s.id === sessionId);

  const [isOpen, setIsOpen] = useState(containsOpenedSession);

  useEffect(() => {
    if (containsOpenedSession) setIsOpen(true);
  }, [sessionId, containsOpenedSession]);

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
            {sessions.length === 0 ? (
              <div className="py-1 px-2 text-xs text-muted-foreground italic">
                No sessions yet
              </div>
            ) : (
              sessions.map((session) => (
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
