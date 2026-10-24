import { useState } from "react";
import { FolderOpen, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { useProjectStore } from "../hooks/useProjectStore";
import { useFetchProjects } from "../hooks/project.queries";

export default function ProjectSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const selectedProjectId = useProjectStore((s) => s.selectedProjectId);
  const setSelectedProjectId = useProjectStore((s) => s.setSelectedProjectId);

  const { data: projects = [] } = useFetchProjects();

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="h-auto min-w-0 max-w-60 gap-2 rounded-full px-3 py-1.5 text-xs font-normal sm:max-w-xs sm:text-sm cursor-pointer transition-all hover:bg-accent/80 hover:text-foreground"
        >
          <FolderOpen className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate">
            {selectedProject?.name || "Select Project"}
          </span>
          <ChevronDown
            className={cn(
              "size-3 shrink-0 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="start"
        sideOffset={8}
        className="w-[calc(100vw-3rem)] max-w-80 overflow-hidden p-0 sm:w-72"
      >
        <Command>
          <CommandInput placeholder="Search projects..." />
          <CommandList className="max-h-60">
            <CommandEmpty>No projects found.</CommandEmpty>
            <CommandGroup heading="Projects">
              {projects.map((project) => {
                const isSelected = project.id === selectedProjectId;
                return (
                  <CommandItem
                    key={project.id}
                    value={project.name}
                    data-checked={isSelected}
                    onSelect={() => {
                      setSelectedProjectId(isSelected ? null : project.id);
                      setIsOpen(false);
                    }}
                  >
                    <FolderOpen className="size-4 shrink-0 text-muted-foreground transition-colors group-data-selected/command-item:text-foreground" />
                    <span className="truncate">{project.name}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
