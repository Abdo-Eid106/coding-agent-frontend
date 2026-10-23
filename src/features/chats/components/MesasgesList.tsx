import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { toast } from "sonner";
import { ArrowDown } from "lucide-react";
import { useFetchMessages } from "../hooks/useMessages";
import TurnItem from "./TurnItem";
import type { MessageDto } from "../types";

const BOTTOM_THRESHOLD_PX = 80;

function useScrollToBottom<T extends HTMLElement>() {
  const scrollRef = useRef<T>(null);
  const [atEnd, setAtEnd] = useState(true);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "auto") => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior });
    }
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setAtEnd(distanceFromBottom < BOTTOM_THRESHOLD_PX);
  }, []);

  useLayoutEffect(() => {
    scrollToBottom();
    const id = requestAnimationFrame(() => scrollToBottom());
    return () => cancelAnimationFrame(id);
  }, [scrollToBottom]);

  return { scrollRef, atEnd, handleScroll, scrollToBottom };
}

function StatusMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-20 text-center text-sm text-muted-foreground min-w-0">
      {children}
    </div>
  );
}

interface MessageListProps {
  sessionId?: string;
}

export default function MessagesList({ sessionId }: MessageListProps) {
  const { data, isPending, isError, error } = useFetchMessages(sessionId);

  useEffect(() => {
    if (isError) {
      toast.error(error?.message ?? "Failed to load messages");
    }
  }, [isError, error]);

  if (!sessionId) {
    return (
      <StatusMessage>Start a new conversation by typing below...</StatusMessage>
    );
  }

  if (isPending) {
    return <StatusMessage>Loading messages...</StatusMessage>;
  }

  return <Messages key={sessionId} messages={data ?? []} />;
}

function Messages({ messages }: { messages: MessageDto[] }) {
  const { scrollRef, atEnd, handleScroll, scrollToBottom } =
    useScrollToBottom<HTMLDivElement>();

  return (
    <div className="relative flex-1 min-h-0 min-w-0 flex flex-col">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden min-w-0 px-3 sm:px-4"
      >
        <div className="relative mx-auto w-full max-w-3xl min-w-0 flex flex-col">
          {messages.map((message) => (
            <div key={message.id} className="w-full py-3 sm:py-4">
              <TurnItem message={message} />
            </div>
          ))}
        </div>
      </div>

      {!atEnd && (
        <button
          type="button"
          aria-label="Jump to latest message"
          className="absolute bottom-4 right-4 grid size-10 place-items-center rounded-full border bg-background shadow cursor-pointer"
          onClick={() => scrollToBottom("smooth")}
        >
          <ArrowDown className="size-4" />
        </button>
      )}
    </div>
  );
}
