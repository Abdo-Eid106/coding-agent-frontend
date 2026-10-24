import { AlertTriangle, Loader2 } from "lucide-react";
import { useDeleteProject } from "../hooks/project.queries";
import { useProjectStore } from "../hooks/useProjectStore";
import { getErrorMessage } from "../../../shared/lib/get-error-message";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type SelectionModal } from "@/shared/hooks/useSelectionModal";

interface Props {
  modal: SelectionModal<{ id: string; name: string }>;
}

export default function DeleteProjectModal({ modal }: Props) {
  const selectedProjectId = useProjectStore((s) => s.selectedProjectId);
  const setSelectedProjectId = useProjectStore((s) => s.setSelectedProjectId);

  const { mutate: deleteProject, isPending } = useDeleteProject();

  const project = modal.selected;
  if (!project) return null;

  const onSuccess = () => {
    if (selectedProjectId === project.id) setSelectedProjectId(null);
    toast.success(`Project "${project.name}" deleted`);
    modal.close();
  };

  const onError = (err: Error) => {
    toast.error(getErrorMessage(err));
  };

  const handleConfirmDelete = () => {
    if (isPending) return;
    deleteProject(project.id, { onSuccess, onError });
  };

  return (
    <Dialog
      open={!!project}
      onOpenChange={(open) => {
        if (!open && !isPending) {
          modal.close();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
              <AlertTriangle className="size-4" />
            </div>
            <div>
              <DialogTitle>Delete Project</DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                This action cannot be undone
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="text-xs text-muted-foreground leading-relaxed">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-foreground break-all">
            &ldquo;{project.name}&rdquo;
          </span>
          ? This will remove the project and its associated chat sessions from
          your workspace.
        </div>

        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => modal.close()}
            disabled={isPending}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleConfirmDelete}
            disabled={isPending}
            className="cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete Project</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
