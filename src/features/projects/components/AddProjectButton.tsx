import { FolderPlus } from "lucide-react";
import { useUIStore } from "../../main/hooks/useUIStore";
import { Button } from "@/components/ui/button";

export default function AddProjectButton() {
  const openAddProject = useUIStore((s) => s.openAddProject);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      onClick={openAddProject}
      title="Add project directory"
      aria-label="Add project directory"
      className="text-muted-foreground hover:text-foreground cursor-pointer"
    >
      <FolderPlus className="size-3.5" />
    </Button>
  );
}
