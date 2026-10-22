import { useParams } from "react-router-dom";
import { PanelLeft } from "lucide-react";
import { useUIStore } from "../../main/hooks/useUIStore";
import ThemeToggle from "../../main/components/ThemeToggle";
import { useFetchSessions } from "../../sessions/hooks/session.queries";
import { useFetchProjects } from "../../projects/hooks/project.queries";
import { useProjectStore } from "../../projects/hooks/useProjectStore";

export default function ChatHeader() {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const { sessionId } = useParams<{ sessionId?: string }>();
  const { data: sessions = [] } = useFetchSessions();
  const { data: projects = [] } = useFetchProjects();
  const selectedProjectId = useProjectStore((s) => s.selectedProjectId);

  const currentSession = sessions.find((s) => s.id === sessionId);
  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const projectTitle = currentSession?.project?.name ?? selectedProject?.name;
  const sessionTitle = currentSession?.title ?? (sessionId ? "Session" : "New Chat");

  return (
    <header className="flex h-13 shrink-0 items-center justify-between border-b border-border px-3 sm:px-4 min-w-0 bg-background">
      <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
        <button
          type="button"
          onClick={toggleSidebar}
          className="cursor-pointer rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0"
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="size-4 shrink-0" />
        </button>

        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-foreground min-w-0">
          {projectTitle && (
            <>
              <span className="truncate max-w-[120px] sm:max-w-[200px] text-muted-foreground font-medium">
                {projectTitle}
              </span>
              <span className="text-muted-foreground/60 font-normal shrink-0">/</span>
            </>
          )}
          <span className="truncate max-w-[150px] sm:max-w-[280px] md:max-w-[400px]">
            {sessionTitle}
          </span>
        </div>
      </div>

      <ThemeToggle />
    </header>
  );
}
