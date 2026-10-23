import { useNavigate } from "react-router-dom";
import { Trash2, CircleStop } from "lucide-react";
import { useUIStore } from "../hooks/useUIStore";
import { type SessionDto } from "../../sessions/types";
import { useCurrentSessionId } from "../../sessions/hooks/useCurrentSessionId";
import {
  useActiveSessions,
  useStopSession,
} from "../../sessions/hooks/session.queries";

interface SessionItemProps {
  session: SessionDto;
  projectId?: string;
}

export default function SessionItem({ session }: SessionItemProps) {
  const sessionId = useCurrentSessionId();
  const navigate = useNavigate();
  const openDeleteSession = useUIStore((s) => s.openDeleteSession);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);
  const { isActive: isSessionRunning } = useActiveSessions();
  const { mutate: stopSession, isPending: isStopping } = useStopSession();

  const isActive = sessionId === session.id;
  const isRunning = isSessionRunning(session.id);

  const handleClick = () => {
    navigate(`/sessions/${session.id}`);
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isStopping) {
      stopSession(session.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    openDeleteSession({
      id: session.id,
      title: session.title || "Untitled Session",
    });
  };

  return (
    <div
      onClick={handleClick}
      className={`group/session flex items-center justify-between w-full h-8 px-3 rounded-lg font-medium transition-colors cursor-pointer select-none ${
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-accent"
      }`}
    >
      <span className="truncate ps-7">
        {session.title || "Untitled Session"}
      </span>

      <div className="flex items-center gap-1 shrink-0 ml-1">
        {isRunning && (
          <button
            type="button"
            onClick={handleStop}
            disabled={isStopping}
            className="size-6 flex items-center justify-center text-foreground hover:text-destructive rounded transition-colors cursor-pointer"
            title="Stop session"
          >
            <CircleStop className="size-3.5" />
          </button>
        )}

        <button
          type="button"
          onClick={handleDelete}
          className="opacity-0 group-hover/session:opacity-100 size-6 flex items-center justify-center text-muted-foreground hover:text-destructive rounded transition-opacity cursor-pointer shrink-0"
          title="Delete session"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
