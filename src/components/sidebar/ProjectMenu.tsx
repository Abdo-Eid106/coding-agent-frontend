import { Plus, Trash2 } from "lucide-react";
import { useProjectStore } from "../../store/useProjectStore";
import { useChatStore } from "../../store/useChatStore";

interface ProjectMenuProps {
  projectId: string;
}

export default function ProjectMenu({ projectId }: ProjectMenuProps) {
  const addSession = useProjectStore((s) => s.addSession);
  const deleteProject = useProjectStore((s) => s.deleteProject);
  const setSelectedProjectId = useProjectStore((s) => s.setSelectedProjectId);
  const newConversation = useChatStore((s) => s.newConversation);

  const handleAddSession = (e: React.MouseEvent) => {
    e.stopPropagation();
    addSession(projectId, "New Session");
    setSelectedProjectId(projectId);
    newConversation();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteProject(projectId);
  };

  return (
    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity shrink-0">
      <button
        type="button"
        onClick={handleAddSession}
        className="p-1 rounded hover:bg-sidebar-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        title="New session"
      >
        <Plus className="size-3.5" />
      </button>

      <button
        type="button"
        onClick={handleDelete}
        className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
        title="Delete project"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
}
