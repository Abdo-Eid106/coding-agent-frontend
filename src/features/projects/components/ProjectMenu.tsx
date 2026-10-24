import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { useProjectStore } from "../hooks/useProjectStore";
import { useSidebar } from "@/components/ui/sidebar";
import DeleteProjectModal from "./DeleteProjectModal";

interface ProjectMenuProps {
  projectId: string;
  projectName?: string;
}

export default function ProjectMenu({
  projectId,
  projectName,
}: ProjectMenuProps) {
  const navigate = useNavigate();
  const { isMobile, setOpenMobile } = useSidebar();
  const setSelectedProjectId = useProjectStore((s) => s.setSelectedProjectId);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleStartNewChatForProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedProjectId(projectId);
    navigate("/");
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <div
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        className="hidden group-hover/menu-item:flex group-focus-within/menu-item:flex items-center gap-0.5 shrink-0"
      >
        <button
          type="button"
          onClick={handleStartNewChatForProject}
          onMouseDown={(e) => e.stopPropagation()}
          className="size-6 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          title="New conversation for this project"
        >
          <Plus className="size-3.5" />
        </button>

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

      <DeleteProjectModal
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        project={{ id: projectId, name: projectName || "this project" }}
      />
    </>
  );
}
