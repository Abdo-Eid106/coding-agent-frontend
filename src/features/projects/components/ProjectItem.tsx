import { FolderOpen, ChevronRight, Trash2 } from "lucide-react";
import { type ProjectDto } from "../types";
import SessionItem from "../../sessions/components/SessionItem";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { cn } from "cn";
import { useCurrentSessionId } from "@/features/sessions/hooks/useCurrentSessionId";
import type { SelectionModal } from "@/shared/hooks/useSelectionModal";
import { useSidebarStore } from "@/features/main/hooks/useSidebarStore";
import { useEffect } from "react";

interface ProjectItemProps {
  project: ProjectDto;
  deleteProjectModal: SelectionModal<{
    id: string;
    name: string;
  }>;
  deleteSessionModal: SelectionModal<{
    id: string;
    title: string;
  }>;
}

export default function ProjectItem({
  project,
  deleteProjectModal,
  deleteSessionModal,
}: ProjectItemProps) {
  const sessionId = useCurrentSessionId();

  const sessions = project.sessions ?? [];

  const isProjectOpen = useSidebarStore((store) =>
    store.isProjectOpen(project.id),
  );
  const toggleProject = useSidebarStore((store) => store.toggleProject);
  const openProject = useSidebarStore((store) => store.openProject);

  const openProjects = useSidebarStore((store) => store.openProjects);

  useEffect(() => {
    const containsOpenedSession =
      !!sessionId && sessions.some((s) => s.id === sessionId);

    if (containsOpenedSession) {
      openProject(project.id);
      openProjects();
    }
  }, [sessionId, sessions]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    deleteProjectModal.open(project);
  };

  return (
    <SidebarMenuItem className="select-none">
      <SidebarMenuButton
        onClick={() => toggleProject(project.id)}
        className="h-8 cursor-pointer select-none pr-16"
      >
        <ChevronRight
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ease-in-out",
            isProjectOpen && "rotate-90",
          )}
        />
        <FolderOpen className="size-4 shrink-0 text-muted-foreground" />
        <span className="truncate font-medium">{project.name}</span>
      </SidebarMenuButton>

      <div className="absolute right-1 top-1.5 flex items-center gap-1">
        <div
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="hidden group-hover/menu-item:flex group-focus-within/menu-item:flex items-center gap-0.5 shrink-0"
        >
          <button
            type="button"
            onClick={handleDelete}
            onMouseDown={(e) => e.stopPropagation()}
            className="size-6 flex items-center justify-center rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
            title="Delete project"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>

      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-200 ease-in-out",
          isProjectOpen
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
                  deleteModal={deleteSessionModal}
                />
              ))
            )}
          </SidebarMenuSub>
        </div>
      </div>
    </SidebarMenuItem>
  );
}
