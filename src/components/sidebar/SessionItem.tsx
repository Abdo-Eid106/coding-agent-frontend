import { useNavigate, useParams } from "react-router-dom";
import { MessageSquare, Trash2 } from "lucide-react";
import type { SessionDto } from "../../queries";
import { useProjectStore } from "../../store/useProjectStore";
import { useUIStore } from "../../store/useUIStore";

interface SessionItemProps {
  session: SessionDto;
  projectId?: string;
}

export default function SessionItem({ session, projectId }: SessionItemProps) {
  const { sessionId } = useParams<{ sessionId?: string }>();
  const navigate = useNavigate();
  const setSelectedProjectId = useProjectStore((s) => s.setSelectedProjectId);
  const openDeleteSession = useUIStore((s) => s.openDeleteSession);

  const isActive = sessionId === session.id;

  const handleClick = () => {
    navigate(`/sessions/${session.id}`);
    if (projectId) {
      setSelectedProjectId(projectId);
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
      className={`group/session flex items-center justify-between w-full px-2 py-1.5 rounded-md text-xs transition-colors cursor-pointer select-none ${
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
      }`}
    >
      <div className="flex items-center gap-1.5 min-w-0 flex-1">
        <MessageSquare className="size-3.5 shrink-0 text-muted-foreground" />
        <span className="truncate">{session.title || "Untitled Session"}</span>
      </div>

      <button
        type="button"
        onClick={handleDelete}
        className="opacity-0 group-hover/session:opacity-100 p-1 text-muted-foreground hover:text-destructive rounded transition-all cursor-pointer shrink-0"
        title="Delete session"
      >
        <Trash2 className="size-3" />
      </button>
    </div>
  );
}
