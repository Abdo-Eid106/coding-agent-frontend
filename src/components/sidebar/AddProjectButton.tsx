import { FolderPlus } from "lucide-react";
import { useUIStore } from "../../store/useUIStore";

export default function AddProjectButton() {
  const openAddProject = useUIStore((s) => s.openAddProject);

  return (
    <button
      type="button"
      onClick={openAddProject}
      title="Add project directory"
      aria-label="Add project directory"
      className="p-1 rounded hover:bg-accent transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
    >
      <FolderPlus className="size-3.5" />
    </button>
  );
}
