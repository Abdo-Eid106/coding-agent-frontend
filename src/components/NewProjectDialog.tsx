import { useState, useRef, useEffect } from "react";
import { FolderPlus } from "lucide-react";

interface NewProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, directory: string) => void;
}

export default function NewProjectDialog({
  isOpen,
  onClose,
  onConfirm,
}: NewProjectDialogProps) {
  const [directory, setDirectory] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const trimmed = directory.trim();
    if (!trimmed) return;
    // Derive name from directory path
    const name = trimmed.split("/").filter(Boolean).pop() || trimmed;
    onConfirm(name, trimmed);
    setDirectory("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        ref={dialogRef}
        className="w-full max-w-md mx-4 rounded-lg border border-border bg-popover text-popover-foreground shadow-xl"
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <FolderPlus className="size-5 text-primary" />
          <h2 className="text-base font-semibold">New Project</h2>
        </div>

        <div className="px-5 py-4 space-y-3">
          <label className="block text-sm text-muted-foreground">
            Working Directory
          </label>
          <input
            ref={inputRef}
            type="text"
            value={directory}
            onChange={(e) => setDirectory(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            placeholder="/home/user/projects/my-project"
            className="w-full px-3 py-2 rounded-md bg-background border border-input text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!directory.trim()}
            className="px-3 py-1.5 rounded-md text-sm bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
