import { PanelLeft } from "lucide-react";
import { useUIStore } from "../../store/useUIStore";
import ThemeToggle from "../ThemeToggle";

export default function ChatHeader() {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const sessionTitle = "title";

  return (
    <header className="flex items-center justify-between border-b border-border px-3 py-2">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={toggleSidebar}
          className="cursor-pointer rounded-md p-1.5 transition-colors hover:bg-accent"
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="size-4 text-muted-foreground" />
        </button>

        {sessionTitle && (
          <span className="max-w-xs truncate text-xs font-medium text-foreground sm:max-w-md">
            {sessionTitle}
          </span>
        )}
      </div>

      <ThemeToggle />
    </header>
  );
}
