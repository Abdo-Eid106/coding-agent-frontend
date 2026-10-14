import { useRef, type ChangeEvent } from "react";
import { FolderPlus } from "lucide-react";
import { useProjectStore } from "../../store/useProjectStore";

declare global {
  interface Window {
    showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle>;
  }
}

// React's types don't include webkitdirectory, so spread it as an object
const directoryInputProps = { webkitdirectory: "" };

export default function AddProjectButton() {
  const addProject = useProjectStore((s) => s.addProject);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = async () => {
    // 1. Native picker (Chromium)
    if (window.showDirectoryPicker) {
      const { name } = await window.showDirectoryPicker();
      addProject(name, name);
      return;
    }
    // 2. Fallback: hidden <input webkitdirectory>
    inputRef.current?.click();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const name = file.webkitRelativePath.split("/")[0] || file.name;
      addProject(name, name);
    }
    e.target.value = "";
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        title="Open folder to add project"
        aria-label="Open folder to add project"
        className="p-1 rounded hover:bg-accent transition-colors cursor-pointer"
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
