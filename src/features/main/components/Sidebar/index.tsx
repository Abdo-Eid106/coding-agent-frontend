import {
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import { Plus, Settings } from "lucide-react";
import ProjectItem from "../ProjectItem";
import SessionItem from "../SessionItem";
import SidebarSection from "./SidebarSection";
import SidebarList from "./SidebarList";
import AddProjectButton from "../../../projects/components/AddProjectButton";
import { useUIStore } from "../../hooks/useUIStore";
import { useCloseSidebarOnMobile } from "./useCloseSidebar";
import { useProjectStore } from "../../../projects/hooks/useProjectStore";
import { useFetchSessions } from "../../../sessions/hooks/session.queries";

interface SidebarButtonProps {
  icon: ComponentType<{ className?: string }>;
  onClick: () => void;
  children: ReactNode;
}

function SidebarButton({ icon: Icon, onClick, children }: SidebarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2.5 w-full h-8 px-3 rounded-lg font-medium text-nowrap text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
    >
      <Icon className="size-4 shrink-0" />
      <span>{children}</span>
    </button>
  );
}

const ASIDE_BASE =
  "fixed inset-y-0 left-0 z-50 flex flex-col h-screen bg-sidebar border-r border-border text-xs transition-all duration-300 ease-in-out md:static md:z-auto";
const ASIDE_OPEN =
  "w-64 min-w-64 translate-x-0 opacity-100 shadow-2xl md:w-60 md:min-w-60 md:shadow-none";
const ASIDE_CLOSED =
  "-translate-x-full opacity-0 pointer-events-none md:w-0 md:min-w-0 md:opacity-0 md:border-r-0 md:overflow-hidden md:pointer-events-auto";

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);
  const openSettings = useUIStore((s) => s.openSettings);
  const setSelectedProjectId = useProjectStore((s) => s.setSelectedProjectId);
  const closeOnMobile = useCloseSidebarOnMobile();

  const { data, isLoading } = useFetchSessions();
  const projects = data?.projects ?? [];
  const sessions = data?.sessions ?? [];

  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [isConversationsOpen, setIsConversationsOpen] = useState(true);

  const currentSessionId = matchPath("/sessions/:sessionId", pathname)?.params
    .sessionId;

  // Booleans, so the effects below run when the *location* of the current
  // session changes, not on every refetch of the lists
  const isInConversations = useMemo(
    () => !!currentSessionId && sessions.some((s) => s.id === currentSessionId),
    [currentSessionId, sessions],
  );
  const isInProjects = useMemo(
    () =>
      !!currentSessionId &&
      projects.some((p) => p.sessions?.some((s) => s.id === currentSessionId)),
    [currentSessionId, projects],
  );

  useEffect(() => {
    if (isInConversations) setIsConversationsOpen(true);
  }, [isInConversations]);

  useEffect(() => {
    if (isInProjects) setIsProjectsOpen(true);
  }, [isInProjects]);

  const handleNewConversation = () => {
    setSelectedProjectId(null);
    navigate("/");
    closeOnMobile();
  };

  const handleOpenSettings = () => {
    openSettings();
    closeOnMobile();
  };

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity duration-300 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`${ASIDE_BASE} ${isSidebarOpen ? ASIDE_OPEN : ASIDE_CLOSED}`}
      >
        <div className="p-3">
          <SidebarButton icon={Plus} onClick={handleNewConversation}>
            New Conversation
          </SidebarButton>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-4">
          <SidebarSection
            title="Projects"
            open={isProjectsOpen}
            onToggle={() => setIsProjectsOpen((v) => !v)}
            action={<AddProjectButton />}
          >
            <SidebarList
              items={projects}
              isLoading={isLoading}
              loadingText="Loading projects..."
              emptyText="No projects added yet"
              renderItem={(project) => (
                <ProjectItem key={project.id} project={project} />
              )}
            />
          </SidebarSection>

          {/* Standalone sessions not linked to a project */}
          <SidebarSection
            title="Conversations"
            open={isConversationsOpen}
            onToggle={() => setIsConversationsOpen((v) => !v)}
            count={sessions.length}
          >
            <SidebarList
              items={sessions}
              isLoading={isLoading}
              loadingText="Loading conversations..."
              emptyText="No conversations yet"
              renderItem={(session) => (
                <SessionItem key={session.id} session={session} />
              )}
            />
          </SidebarSection>
        </div>

        <div className="p-3 border-t border-border">
          <SidebarButton icon={Settings} onClick={handleOpenSettings}>
            Settings
          </SidebarButton>
        </div>
      </aside>
    </>
  );
}
