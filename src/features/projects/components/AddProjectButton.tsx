import { FolderPlus } from "lucide-react";
import { useUIStore } from "../../main/hooks/useUIStore";

export default function AddProjectButton() {
  const openAddProject = useUIStore((s) => s.openAddProject);

  return (
    <button
      type="button"
      onClick={openAddProject}
      title="Add project directory"
      aria-label="Add project directory"
      className="size-6 flex items-center justify-center rounded hover:bg-accent transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
    >
      <FolderPlus className="size-3.5" />
    </button>
  );
}
