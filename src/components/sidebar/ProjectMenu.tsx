import { useState, useRef, useEffect } from "react";
import { Plus, MessageSquarePlus, Trash2 } from "lucide-react";
import Dropdown from "../Dropdown";

interface ProjectMenuProps {
  projectId: string;
  onAddSession: (projectId: string, name: string) => void;
  onDelete: (projectId: string) => void;
}

export default function ProjectMenu({
  projectId,
  onAddSession,
  onDelete,
}: ProjectMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((v) => !v);
        }}
        className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-accent transition-opacity cursor-pointer"
        title="Project actions"
      >
        <Plus className="size-3.5 text-muted-foreground" />
      </button>

      <Dropdown
        isOpen={isOpen}
        direction="down"
        className="absolute right-0 top-full mt-1 z-50"
      >
        <div className="min-w-[160px] rounded-md border border-border bg-popover text-popover-foreground shadow-md py-1">
          <button
            onClick={() => {
              onAddSession(projectId, "New Session");
              setIsOpen(false);
            }}
            className="flex items-center gap-2 w-full px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
          >
            <MessageSquarePlus className="size-4" />
            New Session
          </button>
          <div className="h-px bg-border my-1" />
          <button
            onClick={() => {
              onDelete(projectId);
              setIsOpen(false);
            }}
            className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
          >
            <Trash2 className="size-4" />
            Delete Project
          </button>
        </div>
      </Dropdown>
    </div>
  );
}
