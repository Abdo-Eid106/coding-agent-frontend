import { useRef, type ChangeEvent } from "react";
import { FolderPlus } from "lucide-react";
import { useCreateProject } from "../../queries/project.queries";

declare global {
  interface Window {
    showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle>;
  }
}

// React's types don't include webkitdirectory, so spread it as an object
const directoryInputProps = { webkitdirectory: "" };

export default function AddProjectButton() {
  const { mutate: createProject, isPending } = useCreateProject();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = async () => {
    // 1. Native picker (Chromium)
    if (window.showDirectoryPicker) {
      try {
        const dirHandle = await window.showDirectoryPicker();
        createProject({ directory: dirHandle.name });
      } catch {
        // User cancelled picker
      }
      return;
    }
    // 2. Fallback: hidden <input webkitdirectory>
    inputRef.current?.click();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const name = file.webkitRelativePath.split("/")[0] || file.name;
      createProject({ directory: name });
    }
    e.target.value = "";
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        title="Open folder to add project"
        aria-label="Open folder to add project"
        className="p-1 rounded hover:bg-accent transition-colors cursor-pointer disabled:opacity-50"
      >
        <FolderPlus className="size-3.5 text-muted-foreground" />
      </button>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleInputChange}
        {...directoryInputProps}
      />
    </>
  );
}
