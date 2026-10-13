import { useState, useRef, useEffect } from "react";
import {
  FolderOpen,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  MessageSquarePlus,
} from "lucide-react";
import type { Project } from "../store/types";
import Dropdown from "./Dropdown";

interface ProjectItemProps {
  project: Project;
  activeSessionId: string | null;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAddSession: (projectId: string, name: string) => void;
  onSelectSession: (sessionId: string) => void;
}

export default function ProjectItem({
  project,
  activeSessionId,
  onToggle,
  onDelete,
  onAddSession,
  onSelectSession,
}: ProjectItemProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <div className="select-none">
      {/* Project header row */}
      <div className="group flex items-center gap-1 px-2 py-1.5 rounded-md hover:bg-sidebar-accent cursor-pointer text-sidebar-foreground">
        {/* Collapse chevron + folder icon + name */}
        <button
          onClick={() => onToggle(project.id)}
          className="flex items-center gap-1.5 flex-1 min-w-0 text-left cursor-pointer"
        >
          {project.isExpanded ? (
            <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
          )}
          <FolderOpen className="size-4 shrink-0 text-muted-foreground" />
          <span className="text-sm truncate">{project.name}</span>
        </button>

        {/* + button */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
            className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-accent transition-opacity cursor-pointer"
            title="Project actions"
          >
            <Plus className="size-3.5 text-muted-foreground" />
          </button>

          {/* Dropdown menu */}
          <Dropdown
            isOpen={menuOpen}
            direction="down"
            className="absolute right-0 top-full mt-1 z-50"
          >
            <div className="min-w-[160px] rounded-md border border-border bg-popover text-popover-foreground shadow-md py-1">
              <button
                onClick={() => {
                  onAddSession(project.id, "New Session");
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
              >
                <MessageSquarePlus className="size-4" />
                New Session
              </button>
              <div className="h-px bg-border my-1" />
              <button
                onClick={() => {
                  onDelete(project.id);
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
              >
                <Trash2 className="size-4" />
                Delete Project
              </button>
            </div>
          </Dropdown>
        </div>
      </div>

      {/* Sessions list (collapsible) */}
      <div
        className="overflow-hidden transition-all duration-200"
        style={{
          maxHeight: project.isExpanded
            ? `${project.sessions.length * 40 + 8}px`
            : "0px",
          opacity: project.isExpanded ? 1 : 0,
        }}
      >
        <div className="ml-4 pl-3 border-l border-border/50">
          {project.sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`flex items-center justify-between w-full px-2 py-1.5 rounded-md text-sm transition-colors cursor-pointer ${
                activeSessionId === session.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <span className="truncate">{session.name}</span>
              <span className="text-xs text-muted-foreground ml-2 shrink-0">
                {session.lastActive}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
