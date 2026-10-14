import type { SessionDto } from "../../queries";
import { useChatStore } from "../../store/useChatStore";

interface SessionItemProps {
  session: SessionDto;
}

export default function SessionItem({ session }: SessionItemProps) {
  const currentSessionId = useChatStore((s) => s.currentSessionId);
  const setCurrentSessionId = useChatStore((s) => s.setCurrentSessionId);
  const isActive = currentSessionId === session.id;

  const handleClick = () => {
    setCurrentSessionId(session.id, session.title || "Untitled Session");
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
      <span className="truncate">{session.title || "Untitled Session"}</span>
    </button>
  );
}
