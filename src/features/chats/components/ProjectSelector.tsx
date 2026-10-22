import { useState, useRef, useEffect } from "react";
import { FolderOpen, ChevronDown, Check } from "lucide-react";
import { useProjectStore } from "../../projects/hooks/useProjectStore";
import { useFetchProjects } from "../../projects/hooks/project.queries";
import Dropdown from "../../main/components/Dropdown";

export default function ProjectSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data: projects = [] } = useFetchProjects();
  const selectedProjectId = useProjectStore((s) => s.selectedProjectId);
  const setSelectedProjectId = useProjectStore((s) => s.setSelectedProjectId);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="relative min-w-0" ref={ref}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-popover border border-border text-xs sm:text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer min-w-0 max-w-[240px] sm:max-w-xs"
      >
        <FolderOpen className="size-3.5 text-muted-foreground shrink-0" />
        <span className="truncate">{selectedProject?.name || "Select Project"}</span>
        <ChevronDown className="size-3 text-muted-foreground shrink-0" />
      </button>

      <Dropdown
        isOpen={isOpen}
        direction="up"
        className="absolute bottom-full mb-2 left-0 z-50 max-w-[calc(100vw-2rem)]"
      >
        <div className="w-[calc(100vw-3rem)] sm:w-72 max-w-80 max-h-60 flex flex-col rounded-lg border border-border bg-popover text-popover-foreground shadow-lg overflow-hidden">
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0 border-b border-border/50">
            Project
          </div>
          <div className="overflow-y-auto py-1">
            {projects.length === 0 ? (
              <div className="px-3 py-2 text-xs text-muted-foreground">
                No projects found
              </div>
            ) : (
              projects.map((project) => {
                const isSelected = project.id === selectedProjectId;
                return (
                  <button
                    key={project.id}
                    onClick={() => {
                      setSelectedProjectId(isSelected ? null : project.id);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between w-full px-3 py-2 text-sm cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/50 text-popover-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FolderOpen className="size-4 text-muted-foreground" />
                      <span>{project.name}</span>
                    </div>
                    {isSelected && <Check className="size-4 text-primary" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </Dropdown>
    </div>
  );
}
