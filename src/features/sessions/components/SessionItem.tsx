import { useNavigate, useParams } from "react-router-dom";
import { Trash2, CircleStop } from "lucide-react";
import { type SessionDto } from "../types";
import { useActiveSessions, useStopSession } from "../hooks/session.queries";
import { useUIStore } from "../../main/hooks/useUIStore";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "cn";

interface SessionItemProps {
  session: SessionDto;
  projectId?: string;
}

export default function SessionItem({
  session,
  projectId: _projectId,
}: SessionItemProps) {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId?: string }>();

  const { isMobile, setOpenMobile } = useSidebar();
  const { isActive: isSessionRunning } = useActiveSessions();
  const { mutate: stopSession, isPending: isStopping } = useStopSession();
  const openDeleteSession = useUIStore((s) => s.openDeleteSession);

  const handleClick = () => {
    navigate(`/sessions/${session.id}`);
    if (isMobile) {
      setOpenMobile(false);
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
      title: session.title,
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
        <span className="truncate">
          {session.title || "Untitled Session"}
        </span>
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
        className="cursor-pointer"
      >
        <Trash2 className="size-3.5" />
      </SidebarMenuAction>
    </SidebarMenuItem>
  );
}
