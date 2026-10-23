import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useFetchMessages } from "../hooks/useMessages";
import TurnItem from "./TurnItem";
import { ArrowDown } from "lucide-react";
import type { MessageDto } from "../types";

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
      <div className="flex flex-1 items-center justify-center px-4 py-20 text-center text-sm text-muted-foreground min-w-0">
        Start a new conversation by typing below...
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        Loading messages...
      </div>
    );
  }

  const messages = data ?? [];

  return <NormalMessages key={sessionId} messages={messages} />;
}

function NormalMessages({ messages }: { messages: MessageDto[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atEnd, setAtEnd] = useState(true);

  const scrollToBottom = (behavior: "auto" | "smooth" = "auto") => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior,
      });
    }
  };

  // Track scroll position to show/hide the "scroll to bottom" button
  const handleScroll = () => {
    if (!scrollRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    // 80px threshold to hide the button before hitting the exact bottom pixel
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 80;

    setAtEnd(isAtBottom);
  };

  // Initial scroll to bottom on mount
  useLayoutEffect(() => {
    scrollToBottom();
    const id = requestAnimationFrame(() => scrollToBottom());
    return () => cancelAnimationFrame(id);
  }, []);

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
