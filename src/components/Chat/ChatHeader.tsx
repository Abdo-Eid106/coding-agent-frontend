import { PanelLeft } from "lucide-react";
import { useUIStore } from "../../store/useUIStore";
import ThemeToggle from "../ThemeToggle";

export default function ChatHeader() {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const projectTitle = "coding-agent-frontend";
  const sessionTitle = "Chat Test Session";

  return (
    <header className="flex items-center justify-between border-b border-border px-4 py-2.5">
      <div className="flex min-w-0 items-center gap-2.5">
        <button
          type="button"
          onClick={toggleSidebar}
          className="cursor-pointer rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="size-4 shrink-0" />
        </button>

        <div className="flex items-center gap-1.5 text-sm sm:text-base font-semibold text-foreground min-w-0">
          <span className="truncate text-muted-foreground font-medium">{projectTitle}</span>
          <span className="text-muted-foreground/60 font-normal">/</span>
          <span className="truncate">{sessionTitle}</span>
        </div>
      </div>

      <ThemeToggle />
    </header>
  );
}
