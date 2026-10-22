import { useNavigate } from "react-router-dom";
import { Plus, Settings } from "lucide-react";
import ProjectItem from "./ProjectItem";
import AddProjectButton from "../../projects/components/AddProjectButton";
import { useUIStore } from "../hooks/useUIStore";
import { useProjectStore } from "../../projects/hooks/useProjectStore";
import { useFetchProjects } from "../../projects/hooks/project.queries";

export default function Sidebar() {
  const navigate = useNavigate();
  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);
  const openSettings = useUIStore((s) => s.openSettings);
  const setSelectedProjectId = useProjectStore((s) => s.setSelectedProjectId);
  const { data: projects = [], isLoading } = useFetchProjects();

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

      {/* Projects section */}
      <div className="flex-1 overflow-y-auto px-3">
        <div className="flex items-center justify-between px-2 mb-2 mt-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Projects
          </span>
          <AddProjectButton />
        </div>

        {/* Project list */}
        <div className="space-y-1">
          {isLoading ? (
            <div className="px-2 py-3 text-muted-foreground animate-pulse">
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="px-2 py-3 text-muted-foreground">
              No projects added yet
            </div>
          ) : (
            projects.map((project) => (
              <ProjectItem key={project.id} project={project} />
            ))
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
