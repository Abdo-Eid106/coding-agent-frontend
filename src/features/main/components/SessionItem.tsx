import { useNavigate } from "react-router-dom";
import { Trash2, CircleStop } from "lucide-react";
import { useUIStore } from "../hooks/useUIStore";
import { type SessionDto } from "../../sessions/types";
import { useCurrentSessionId } from "../../sessions/hooks/useCurrentSessionId";
import {
  useActiveSessions,
  useStopSession,
} from "../../sessions/hooks/session.queries";
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

export default function SessionItem({ session }: SessionItemProps) {
  const sessionId = useCurrentSessionId();
  const navigate = useNavigate();
  const openDeleteSession = useUIStore((s) => s.openDeleteSession);
  const { isMobile, setOpenMobile } = useSidebar();
  const { isActive: isSessionRunning } = useActiveSessions();
  const { mutate: stopSession, isPending: isStopping } = useStopSession();

  const isActive = sessionId === session.id;
  const isRunning = isSessionRunning(session.id);

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
      title: session.title || "Untitled Session",
    });
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        onClick={handleClick}
        className={cn("h-8 cursor-pointer select-none", isRunning && "pr-12!")}
      >
        <span className="truncate">{session.title || "Untitled Session"}</span>
      </SidebarMenuButton>

      {isRunning && (
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
