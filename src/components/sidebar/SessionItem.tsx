import type { Session } from "../../store/types";

interface SessionItemProps {
  session: Session;
  isActive: boolean;
  onSelect: (sessionId: string) => void;
}

export default function SessionItem({
  session,
  isActive,
  onSelect,
}: SessionItemProps) {
  return (
    <button
      onClick={() => onSelect(session.id)}
      className={`flex items-center justify-between w-full px-2 py-1.5 rounded-md text-sm transition-colors cursor-pointer ${
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
      }`}
    >
      <span className="truncate">{session.name}</span>
      <span className="text-xs text-muted-foreground ml-2 shrink-0">
        {session.lastActive}
      </span>
    </button>
  );
}
