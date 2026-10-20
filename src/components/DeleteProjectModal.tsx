import { useEffect, useRef } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { useDeleteProject } from "../queries/project.queries";
import { useUIStore, type ProjectToDelete } from "../store/useUIStore";
import { useProjectStore } from "../store/useProjectStore";
import { getErrorMessage } from "../shared/lib/get-error-message";
import { toast } from "./Toaster";

export default function DeleteProjectModal() {
  const projectToDelete = useUIStore((s) => s.projectToDelete);
  const onClose = useUIStore((s) => s.closeDeleteProject);

  if (!projectToDelete) return null;

  return (
    <DeleteProjectDialog
      project={projectToDelete}
      onClose={onClose}
    />
  );
}

interface DeleteProjectDialogProps {
  project: ProjectToDelete;
  onClose: () => void;
}

function DeleteProjectDialog({ project, onClose }: DeleteProjectDialogProps) {
  const cancelBtnRef = useRef<HTMLButtonElement>(null);
  const { mutate: deleteProject, isPending } = useDeleteProject();
  const selectedProjectId = useProjectStore((s) => s.selectedProjectId);
  const setSelectedProjectId = useProjectStore((s) => s.setSelectedProjectId);

  // Focus cancel button on mount for safety
  useEffect(() => {
    cancelBtnRef.current?.focus();
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isPending) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPending, onClose]);

  const handleConfirmDelete = () => {
    if (isPending) return;

    deleteProject(project.id, {
      onSuccess: () => {
        if (selectedProjectId === project.id) {
          setSelectedProjectId(null);
        }
        toast.success(`Project "${project.name}" deleted`);
        onClose();
      },
      onError: (err) => {
        toast.error(getErrorMessage(err));
      },
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 transition-opacity duration-200 starting:opacity-0"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isPending) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-project-title"
        className="bg-card text-card-foreground border border-border w-full max-w-md rounded-xl shadow-2xl p-5 flex flex-col gap-4 transition-all duration-200 starting:opacity-0 starting:scale-95 starting:translate-y-2"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
              <AlertTriangle className="size-4" />
            </div>
            <div>
              <h3 id="delete-project-title" className="text-sm font-semibold text-foreground">
                Delete Project
              </h3>
              <p className="text-xs text-muted-foreground">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            aria-label="Close modal"
            className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors disabled:opacity-50 cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="text-xs text-muted-foreground leading-relaxed">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-foreground break-all">
            &ldquo;{project.name}&rdquo;
          </span>
          ? This will remove the project and its associated chat sessions from your workspace.
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border hover:bg-accent text-foreground transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmDelete}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete Project</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
