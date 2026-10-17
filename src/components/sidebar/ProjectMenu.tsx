import { useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { useProjectStore } from "../../store/useProjectStore";
import { useUIStore } from "../../store/useUIStore";

interface ProjectMenuProps {
  projectId: string;
  projectName?: string;
}

export default function ProjectMenu({ projectId, projectName }: ProjectMenuProps) {
  const navigate = useNavigate();
  const openDeleteProject = useUIStore((s) => s.openDeleteProject);
  const setSelectedProjectId = useProjectStore((s) => s.setSelectedProjectId);

  const handleStartNewChatForProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedProjectId(projectId);
    navigate("/");
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    openDeleteProject({ id: projectId, name: projectName || "this project" });
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity shrink-0"
    >
      <button
        type="button"
        onClick={handleStartNewChatForProject}
        onMouseDown={(e) => e.stopPropagation()}
        className="p-1 rounded hover:bg-sidebar-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        title="New conversation for this project"
      >
        <Plus className="size-3.5" />
      </button>

      <button
        type="button"
        onClick={handleDelete}
        onMouseDown={(e) => e.stopPropagation()}
        className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
        title="Delete project"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
}
