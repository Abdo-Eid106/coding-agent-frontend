import { useEffect, useState, type FormEvent } from "react";
import { X, Loader2, Folder } from "lucide-react";
import { toast } from "sonner";
import { useCreateProject } from "../queries/project.queries";
import { useUIStore } from "../store/useUIStore";
import { getErrorMessage } from "../shared/lib/get-error-message";

export default function AddProjectModal() {
  const isOpen = useUIStore((s) => s.isAddProjectOpen);
  const closeModal = useUIStore((s) => s.closeAddProject);

  const [directory, setDirectory] = useState("");
  const { mutate: createProject, isPending } = useCreateProject();

  const path = directory.trim();

  const close = () => {
    if (isPending) return;
    setDirectory("");
    closeModal();
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, isPending]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!path || isPending) return;

    createProject(
      { directory: path },
      {
        onSuccess: close,
        onError: (err) => toast.error(getErrorMessage(err)),
      },
    );
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && close()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 transition-opacity duration-200 starting:opacity-0"
    >
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        data-form-type="other"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-project-title"
        className="bg-card text-card-foreground border border-border w-full max-w-md rounded-xl shadow-2xl p-5 space-y-4 transition-all duration-200 starting:opacity-0 starting:scale-95 starting:translate-y-2"
      >
        <header className="grid grid-cols-[auto_1fr_auto] items-center gap-x-2 pb-2 border-b border-border">
          <Folder className="row-span-2 size-7 p-1.5 rounded-md bg-primary/10 text-primary" />
          <h3 id="add-project-title" className="text-sm font-semibold">
            Add Project
          </h3>
          <button
            type="button"
            onClick={close}
            disabled={isPending}
            aria-label="Close modal"
            className="row-span-2 p-1 text-muted-foreground hover:text-foreground rounded transition-colors disabled:opacity-50 cursor-pointer"
          >
            <X className="size-4" />
          </button>
          <p className="text-xs text-muted-foreground">
            Enter the absolute directory path on your machine
          </p>
        </header>

        <div className="space-y-1.5">
          <label
            htmlFor="project-directory-path"
            className="block text-xs font-medium"
          >
            Directory Path
          </label>
          <input
            id="project-directory-path"
            name="project_directory_path"
            type="text"
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            data-lpignore="true"
            data-1p-ignore="true"
            data-bwignore="true"
            data-form-type="other"
            spellCheck={false}
            value={directory}
            onChange={(e) => setDirectory(e.target.value)}
            disabled={isPending}
            placeholder="/home/username/projects/my-app or C:\projects\my-app"
            className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-input placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring font-mono transition-colors disabled:opacity-50"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={close}
            disabled={isPending}
            className="px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending || !path}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isPending && <Loader2 className="size-3.5 animate-spin" />}
            {isPending ? "Adding..." : "Add Project"}
          </button>
        </div>
      </form>
    </div>
  );
}
