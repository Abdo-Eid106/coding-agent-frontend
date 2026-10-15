import { MessageSquare, Trash2 } from "lucide-react";
import type { SessionDto } from "../../queries";
import { useChatStore } from "../../store/useChatStore";
import { useProjectStore } from "../../store/useProjectStore";
import { useDeleteSession } from "../../queries/session.queries";

interface SessionItemProps {
  session: SessionDto;
  projectId?: string;
}

export default function SessionItem({ session, projectId }: SessionItemProps) {
  const currentSessionId = useChatStore((s) => s.currentSessionId);
  const setCurrentSessionId = useChatStore((s) => s.setCurrentSessionId);
  const newConversation = useChatStore((s) => s.newConversation);
  const setSelectedProjectId = useProjectStore((s) => s.setSelectedProjectId);

  const { mutate: deleteSession, isPending: isDeleting } = useDeleteSession();

  const isActive = currentSessionId === session.id;

  const handleClick = () => {
    setCurrentSessionId(session.id, session.title || "Untitled Session");
    if (projectId) {
      setSelectedProjectId(projectId);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isDeleting) return;

    deleteSession(session.id, {
      onSuccess: () => {
        if (currentSessionId === session.id) {
          newConversation();
        }
      },
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
        disabled={isDeleting}
        className="opacity-0 group-hover/session:opacity-100 p-1 text-muted-foreground hover:text-destructive rounded transition-all cursor-pointer shrink-0 disabled:opacity-50"
        title="Delete session"
      >
        <Trash2 className="size-3" />
      </button>
    </div>
  );
}
