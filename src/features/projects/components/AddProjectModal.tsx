import { useState, type SubmitEvent } from "react";
import { Folder, FolderPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCreateProject } from "../hooks/project.queries";
import { getErrorMessage } from "../../../shared/lib/get-error-message";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useModal } from "@/shared/hooks/useModal";

const INPUT_ID = "project-directory-path";
const PATH_PLACEHOLDER =
  "/home/username/projects/my-app or C:\\projects\\my-app";

export default function AddProjectModal() {
  const { isOpen, setIsOpen } = useModal();
  const [directory, setDirectory] = useState("");
  const { mutate: createProject, isPending } = useCreateProject();

  const path = directory.trim();
  const canSubmit = path.length > 0 && !isPending;

  const handleOpenChange = (next: boolean) => {
    if (!next && isPending) return;
    setIsOpen(next);
    if (!next) setDirectory("");
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;

    createProject(
      { directory: path },
      {
        onSuccess: () => handleOpenChange(false),
        onError: (err) => toast.error(getErrorMessage(err)),
      },
    );
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={() => handleOpenChange(true)}
        title="Add project directory"
        aria-label="Add project directory"
        className="cursor-pointer text-muted-foreground hover:text-foreground"
      >
        <FolderPlus className="size-3.5" />
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Folder className="size-4" />
                </div>
                <div>
                  <DialogTitle>Add Project</DialogTitle>
                  <DialogDescription className="mt-0.5 text-xs">
                    Enter the absolute directory path on your machine
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-1.5">
              <label
                htmlFor={INPUT_ID}
                className="block text-xs font-medium text-foreground"
              >
                Directory Path
              </label>
              <Input
                id={INPUT_ID}
                name="project_directory_path"
                type="text"
                autoFocus
                autoComplete="off"
                spellCheck={false}
                value={directory}
                onChange={(e) => setDirectory(e.target.value)}
                disabled={isPending}
                placeholder={PATH_PLACEHOLDER}
                className="font-mono text-xs"
              />
            </div>

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleOpenChange(false)}
                disabled={isPending}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!canSubmit}
                className="cursor-pointer"
              >
                {isPending && <Loader2 className="size-3.5 animate-spin" />}
                {isPending ? "Adding..." : "Add Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
