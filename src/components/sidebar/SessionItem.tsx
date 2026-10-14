import type { Session } from "../../store/types";
import { useChatStore } from "../../store/useChatStore";
import { INITIAL_TURNS } from "../../store/initialTurns";

interface SessionItemProps {
  session: Session;
}

export default function SessionItem({ session }: SessionItemProps) {
  const currentSessionId = useChatStore((s) => s.currentSession?.id);
  const setSession = useChatStore((s) => s.setSession);
  const isActive = currentSessionId === session.id;

  const handleClick = () => {
    setSession({
      ...session,
      title: session.title || session.name || "Untitled Session",
      turns: session.turns?.length ? session.turns : INITIAL_TURNS,
    });
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-between w-full px-2 py-1.5 rounded-md text-sm transition-colors cursor-pointer ${
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
      }`}
    >
      <span className="truncate">{session.title || session.name}</span>
      <span className="text-xs text-muted-foreground ml-2 shrink-0">
        {session.lastActive}
      </span>
    </button>
  );
}
