import { useNavigate, useParams } from "react-router-dom";
import { Trash2, CircleStop } from "lucide-react";
import { type SessionDto } from "../types";
import { useActiveSessions, useStopSession } from "../hooks/session.queries";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "cn";
import type { SelectionModal } from "@/shared/hooks/useSelectionModal";

interface SessionItemProps {
  session: SessionDto;
  deleteModal: SelectionModal<{ id: string; title: string }>;
}

export default function SessionItem({
  session,
  deleteModal,
}: SessionItemProps) {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId?: string }>();

  const { isMobile, setOpenMobile } = useSidebar();
  const { isActive: isSessionRunning } = useActiveSessions();
  const { mutate: stopSession, isPending: isStopping } = useStopSession();

  const handleClick = () => {
    navigate(`/sessions/${session.id}`);
    if (isMobile) setOpenMobile(false);
  };

  const handleStop = (e: React.MouseEvent) => {
    (e.stopPropagation(), e.preventDefault());
    if (!isStopping) stopSession(session.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    (e.stopPropagation(), e.preventDefault());
    deleteModal.open({
      id: session.id,
      title: session.title ?? "untitled session",
    });
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={sessionId === session.id}
        onClick={handleClick}
        className={cn(
          "h-8 cursor-pointer select-none",
          isSessionRunning(session.id) && "pr-12!",
        )}
      >
        <span className="truncate">{session.title || "Untitled Session"}</span>
      </SidebarMenuButton>

      {isSessionRunning(session.id) && (
        <button
          type="button"
          onClick={handleStop}
          disabled={isStopping}
          className="absolute top-1.5 right-6 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-foreground hover:text-destructive transition-colors cursor-pointer"
          title="Stop session"
        >
          <CircleStop className="size-3.5 text-destructive animate-pulse" />
        </button>
      )}

      <SidebarMenuAction
        showOnHover
        onClick={handleDelete}
        title="Delete session"
        className="cursor-pointer hover:text-destructive"
      >
        <Trash2 className="size-3.5" />
      </SidebarMenuAction>
    </SidebarMenuItem>
  );
}
