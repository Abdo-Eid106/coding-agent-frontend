import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Settings } from "lucide-react";
import ProjectItem from "../ProjectItem";
import SessionItem from "../SessionItem";
import SidebarSection from "./SidebarSection";
import SidebarList from "./SidebarList";
import AddProjectModal from "@/features/projects/components/AddProjectModal";
import { useUIStore } from "../../hooks/useUIStore";
import { useCloseSidebarOnMobile } from "./useCloseSidebar";
import { useProjectStore } from "../../../projects/hooks/useProjectStore";
import { useFetchSessions } from "../../../sessions/hooks/session.queries";
import { useCurrentSessionId } from "../../../sessions/hooks/useCurrentSessionId";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";

export default function Sidebar() {
  const navigate = useNavigate();

  const openSettings = useUIStore((s) => s.openSettings);
  const setSelectedProjectId = useProjectStore((s) => s.setSelectedProjectId);
  const closeOnMobile = useCloseSidebarOnMobile();

  const { data, isLoading } = useFetchSessions();
  const projects = useMemo(() => data?.projects ?? [], [data?.projects]);
  const sessions = useMemo(() => data?.sessions ?? [], [data?.sessions]);

  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [isConversationsOpen, setIsConversationsOpen] = useState(true);

  const currentSessionId = useCurrentSessionId();
  const [prevSessionId, setPrevSessionId] = useState(currentSessionId);

  // Auto-expand sections if the active session belongs to them
  if (currentSessionId && currentSessionId !== prevSessionId) {
    setPrevSessionId(currentSessionId);
    if (sessions.some((s) => s.id === currentSessionId)) {
      setIsConversationsOpen(true);
    }
    if (
      projects.some((p) => p.sessions?.some((s) => s.id === currentSessionId))
    ) {
      setIsProjectsOpen(true);
    }
  } else if (currentSessionId !== prevSessionId) {
    setPrevSessionId(currentSessionId);
  }

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
    <ShadcnSidebar collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleNewConversation}
              className="cursor-pointer font-medium"
            >
              <Plus className="size-4 shrink-0" />
              <span>New Conversation</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 space-y-3">
        <SidebarSection
          title="Projects"
          open={isProjectsOpen}
          onToggle={() => setIsProjectsOpen((v) => !v)}
          action={<AddProjectModal />}
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
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleOpenSettings}
              className="cursor-pointer font-medium"
            >
              <Settings className="size-4 shrink-0" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </ShadcnSidebar>
  );
}
