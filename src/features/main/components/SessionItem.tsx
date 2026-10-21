import { useNavigate, useParams } from "react-router-dom";
import { MessageSquare, Trash2 } from "lucide-react";
import { useProjectStore } from "../../projects/hooks/useProjectStore";
import { useUIStore } from "../hooks/useUIStore";
import { type SessionDto } from "../../sessions/types";

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
      className={`group/session flex items-center justify-between w-full h-8 px-3 rounded-lg font-medium transition-colors cursor-pointer select-none ${
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-accent"
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <MessageSquare className="size-4 shrink-0" />
        <span className="truncate">{session.title || "Untitled Session"}</span>
      </div>

      <button
        type="button"
        onClick={handleDelete}
        className="opacity-0 group-hover/session:opacity-100 size-6 flex items-center justify-center text-muted-foreground hover:text-destructive rounded transition-opacity cursor-pointer shrink-0"
        title="Delete session"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
}
