import { Plus, Trash2 } from "lucide-react";
import { useProjectStore } from "../../store/useProjectStore";
import { useChatStore } from "../../store/useChatStore";
import { useDeleteProject } from "../../queries/project.queries";

interface ProjectMenuProps {
  projectId: string;
}

export default function ProjectMenu({ projectId }: ProjectMenuProps) {
  const { mutate: deleteProject, isPending } = useDeleteProject();
  const selectedProjectId = useProjectStore((s) => s.selectedProjectId);
  const setSelectedProjectId = useProjectStore((s) => s.setSelectedProjectId);
  const newConversation = useChatStore((s) => s.newConversation);

  const handleStartNewChatForProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedProjectId(projectId);
    newConversation();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (selectedProjectId === projectId) {
      setSelectedProjectId(null);
    }
    deleteProject(projectId);
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
        disabled={isPending}
        onMouseDown={(e) => e.stopPropagation()}
        className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer disabled:opacity-50"
        title="Delete project"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
}
