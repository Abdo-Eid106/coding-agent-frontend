import { useParams } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useFetchSession } from "../../sessions/hooks/session.queries";
import ThemeToggle from "../../main/components/ThemeToggle";

export default function ChatHeader() {
  const { sessionId } = useParams<{ sessionId?: string }>();
  const isNew = !sessionId;

  const { data, isLoading } = useFetchSession(sessionId);

  const projectTitle = data?.project?.name;
  const sessionTitle = isNew
    ? "New Chat"
    : isLoading
      ? "...Loading"
      : data?.title;

  return (
    <header className="flex h-13 shrink-0 items-center justify-between border-b border-border px-3 sm:px-4 min-w-0 bg-background">
      <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
        <SidebarTrigger className="cursor-pointer" />

        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-foreground min-w-0">
          {projectTitle && (
            <>
              <span className="truncate max-w-30 sm:max-w-50 text-muted-foreground font-medium">
                {projectTitle}
              </span>
              <span className="text-muted-foreground/60 font-normal shrink-0">
                /
              </span>
            </>
          )}
          <span className="truncate max-w-37.5 sm:max-w-70 md:max-w-100">
            {sessionTitle}
          </span>
        </div>
      </div>

      <ThemeToggle />
    </header>
  );
}
