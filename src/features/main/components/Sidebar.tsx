import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus, Settings, ChevronDown, ChevronRight } from "lucide-react";
import ProjectItem from "./ProjectItem";
import SessionItem from "./SessionItem";
import AddProjectButton from "../../projects/components/AddProjectButton";
import { useUIStore } from "../hooks/useUIStore";
import { useProjectStore } from "../../projects/hooks/useProjectStore";
import { useFetchSessions } from "../../sessions/hooks/session.queries";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);

  const openSettings = useUIStore((s) => s.openSettings);

  const setSelectedProjectId = useProjectStore((s) => s.setSelectedProjectId);

  const { data, isLoading } = useFetchSessions();
  const projects = data?.projects ?? [];
  const sessions = data?.sessions ?? [];

  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [isConversationsOpen, setIsConversationsOpen] = useState(true);

  // Extract current sessionId from pathname (e.g. /sessions/:sessionId)
  const currentSessionId = location.pathname.match(/^\/sessions\/([^/]+)/)?.[1];

  // Auto-expand conversations if current session is an unlinked session
  useEffect(() => {
    if (currentSessionId && sessions.some((s) => s.id === currentSessionId)) {
      setIsConversationsOpen(true);
    }
  }, [currentSessionId, sessions]);

  // Auto-expand projects if current session is under any project
  useEffect(() => {
    if (
      currentSessionId &&
      projects.some((p) => p.sessions?.some((s) => s.id === currentSessionId))
    ) {
      setIsProjectsOpen(true);
    }
  }, [currentSessionId, projects]);

  const handleNewConversation = () => {
    setSelectedProjectId(null);
    navigate("/");
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleOpenSettings = () => {
    openSettings();
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity duration-300 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col h-screen bg-sidebar border-r border-border text-xs transition-all duration-300 ease-in-out md:static md:z-auto ${
          isSidebarOpen
            ? "w-64 min-w-64 translate-x-0 opacity-100 shadow-2xl md:w-60 md:min-w-60 md:shadow-none"
            : "-translate-x-full opacity-0 pointer-events-none md:w-0 md:min-w-0 md:opacity-0 md:border-r-0 md:overflow-hidden md:pointer-events-auto"
        }`}
      >
        {/* Top section: Logo + New Conversation */}
        <div className="p-3 space-y-2">
          {/* New Conversation button */}
          <button
            onClick={handleNewConversation}
            className="flex items-center gap-2.5 w-full h-8 px-3 rounded-lg font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer text-nowrap"
          >
            <Plus className="size-4 shrink-0" />
            <span>New Conversation</span>
          </button>
        </div>

        {/* Scrollable body: Projects and Conversations */}
        <div className="flex-1 overflow-y-auto px-3 space-y-4">
          {/* Projects section */}
          <div>
            <div
              onClick={() => setIsProjectsOpen((v) => !v)}
              className="flex items-center justify-between px-2 py-1 mb-1 mt-1 rounded cursor-pointer select-none text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-1.5">
                {isProjectsOpen ? (
                  <ChevronDown className="size-3.5 shrink-0" />
                ) : (
                  <ChevronRight className="size-3.5 shrink-0" />
                )}
                <span className="text-[11px] font-semibold uppercase tracking-wider">
                  Projects
                </span>
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <AddProjectButton />
              </div>
            </div>

            {/* Project list */}
            {isProjectsOpen && (
              <div className="space-y-1">
                {isLoading ? (
                  <div className="px-2 py-3 text-muted-foreground animate-pulse">
                    Loading projects...
                  </div>
                ) : projects.length === 0 ? (
                  <div className="px-2 py-2 text-muted-foreground">
                    No projects added yet
                  </div>
                ) : (
                  projects.map((project) => (
                    <ProjectItem key={project.id} project={project} />
                  ))
                )}
              </div>
            )}
          </div>

          {/* Conversations section (standalone sessions not linked to projects) */}
          <div>
            <div
              onClick={() => setIsConversationsOpen((v) => !v)}
              className="flex items-center justify-between px-2 py-1 mb-1 rounded cursor-pointer select-none text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-1.5">
                {isConversationsOpen ? (
                  <ChevronDown className="size-3.5 shrink-0" />
                ) : (
                  <ChevronRight className="size-3.5 shrink-0" />
                )}
                <span className="text-[11px] font-semibold uppercase tracking-wider">
                  Conversations
                </span>
              </div>
              {sessions.length > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border shrink-0">
                  {sessions.length}
                </span>
              )}
            </div>

            {/* Conversations list */}
            {isConversationsOpen && (
              <div className="space-y-1">
                {isLoading ? (
                  <div className="px-2 py-3 text-muted-foreground animate-pulse">
                    Loading conversations...
                  </div>
                ) : sessions.length === 0 ? (
                  <div className="px-2 py-2 text-muted-foreground">
                    No conversations yet
                  </div>
                ) : (
                  sessions.map((session) => (
                    <SessionItem key={session.id} session={session} />
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom section */}
        <div className="p-3 border-t border-border">
          <button
            onClick={handleOpenSettings}
            className="flex items-center gap-2.5 w-full h-8 px-3 rounded-lg font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
          >
            <Settings className="size-4 shrink-0" />
            Settings
          </button>
        </div>
      </aside>
    </>
  );
}
