import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronRight, Plus, Settings } from "lucide-react";
import ProjectItem from "./ProjectItem";
import SessionItem from "../../sessions/components/SessionItem";
import AddProjectModal from "@/features/projects/components/AddProjectModal";
import SettingsModal from "@/features/settings/components/SettingsModal";
import { useProjectStore } from "../../projects/hooks/useProjectStore";
import { useFetchSessions } from "../../sessions/hooks/session.queries";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSkeleton,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { cn } from "cn";

export default function Sidebar() {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId?: string }>();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [isConversationsOpen, setIsConversationsOpen] = useState(true);
  const { setOpenMobile } = useSidebar();
  const setSelectedProjectId = useProjectStore((s) => s.setSelectedProjectId);

  const { data, isLoading } = useFetchSessions();
  const projects = data?.projects ?? [];
  const sessions = data?.sessions ?? [];

  useEffect(() => {
    if (!sessionId || !data) return;

    const isStandalone = data.sessions.some((s) => s.id === sessionId);
    if (isStandalone) {
      setIsConversationsOpen(true);
      return;
    }

    const inProject = data.projects.some((p) =>
      p.sessions?.some((s) => s.id === sessionId),
    );
    if (inProject) setIsProjectsOpen(true);
  }, [sessionId, data]);

  const handleNewConversation = () => {
    setSelectedProjectId(null);
    navigate("/");
    setOpenMobile(false);
  };

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
    setOpenMobile(false);
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
        {/* Projects */}
        <SidebarGroup className="p-0">
          <div className="flex items-center justify-between">
            <SidebarGroupLabel
              render={
                <button
                  type="button"
                  onClick={() => setIsProjectsOpen((v) => !v)}
                  aria-expanded={isProjectsOpen}
                  className="flex flex-1 items-center gap-1.5 cursor-pointer select-none text-muted-foreground hover:text-sidebar-foreground transition-colors p-0 h-7"
                />
              }
            >
              <ChevronRight
                className={cn(
                  "size-3.5 shrink-0 transition-transform duration-200 ease-in-out",
                  isProjectsOpen && "rotate-90",
                )}
              />
              <span className="text-[11px] font-semibold uppercase tracking-wider">
                Projects
              </span>
            </SidebarGroupLabel>

            <div className="shrink-0">
              <AddProjectModal />
            </div>
          </div>

          <div
            className={cn(
              "grid transition-[grid-template-rows,opacity] duration-200 ease-in-out",
              isProjectsOpen
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0 pointer-events-none",
            )}
          >
            <div className="overflow-hidden">
              <SidebarGroupContent className="mt-1">
                <SidebarMenu className="gap-0.5">
                  {isLoading ? (
                    <div className="flex flex-col gap-1 py-1">
                      <SidebarMenuSkeleton showIcon />
                      <SidebarMenuSkeleton showIcon />
                      <SidebarMenuSkeleton showIcon />
                    </div>
                  ) : projects.length === 0 ? (
                    <div className="px-2 py-2 text-xs text-muted-foreground select-none">
                      No projects added yet
                    </div>
                  ) : (
                    projects.map((project) => (
                      <ProjectItem key={project.id} project={project} />
                    ))
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </div>
          </div>
        </SidebarGroup>

        {/* Standalone sessions not linked to a project */}
        <SidebarGroup className="p-0">
          <div className="flex items-center justify-between">
            <SidebarGroupLabel
              render={
                <button
                  type="button"
                  onClick={() => setIsConversationsOpen((v) => !v)}
                  aria-expanded={isConversationsOpen}
                  className="flex flex-1 items-center gap-1.5 cursor-pointer select-none text-muted-foreground hover:text-sidebar-foreground transition-colors p-0 h-7"
                />
              }
            >
              <ChevronRight
                className={cn(
                  "size-3.5 shrink-0 transition-transform duration-200 ease-in-out",
                  isConversationsOpen && "rotate-90",
                )}
              />
              <span className="text-[11px] font-semibold uppercase tracking-wider">
                Conversations
              </span>
              <Badge
                variant="secondary"
                className="ml-auto mr-1 h-4 px-1.5 text-[10px] font-mono text-muted-foreground"
              >
                {sessions.length}
              </Badge>
            </SidebarGroupLabel>
          </div>

          <div
            className={cn(
              "grid transition-[grid-template-rows,opacity] duration-200 ease-in-out",
              isConversationsOpen
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0 pointer-events-none",
            )}
          >
            <div className="overflow-hidden">
              <SidebarGroupContent className="mt-1">
                <SidebarMenu className="gap-0.5">
                  {isLoading ? (
                    <div className="flex flex-col gap-1 py-1">
                      <SidebarMenuSkeleton showIcon />
                      <SidebarMenuSkeleton showIcon />
                      <SidebarMenuSkeleton showIcon />
                    </div>
                  ) : sessions.length === 0 ? (
                    <div className="px-2 py-2 text-xs text-muted-foreground select-none">
                      No conversations yet
                    </div>
                  ) : (
                    sessions.map((session) => (
                      <SessionItem key={session.id} session={session} />
                    ))
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </div>
          </div>
        </SidebarGroup>
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
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <SidebarRail />
    </ShadcnSidebar>
  );
}
