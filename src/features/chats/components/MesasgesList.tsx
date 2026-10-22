import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { toast } from "sonner";
import { useFetchMessages } from "../hooks/useMessages";
import TurnItem from "./TurnItem";
import { ArrowDown } from "lucide-react";
import type { MessageDto } from "../types";

interface MessageListProps {
  sessionId?: string;
}

export default function MessagesList({ sessionId }: MessageListProps) {
  const {
    data,
    isPending,
    isError,
    error,
    hasPreviousPage,
    isFetchingPreviousPage,
    fetchPreviousPage,
  } = useFetchMessages(sessionId);

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

  const messages = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <VirtualMessages
      key={sessionId}
      messages={messages}
      isFetchingOlder={isFetchingPreviousPage}
      onLoadOlder={() => {
        if (hasPreviousPage && !isFetchingPreviousPage) {
          void fetchPreviousPage();
        }
      }}
    />
  );
}

function VirtualMessages({
  messages,
  isFetchingOlder,
  onLoadOlder,
}: {
  messages: MessageDto[];
  isFetchingOlder: boolean;
  onLoadOlder: () => void;
}) {
  const parentRef = useRef<HTMLDivElement>(null);
  const lastScrollTopRef = useRef(0);
  const [atEnd, setAtEnd] = useState(true);

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
    getItemKey: (index) => messages[index]!.id,
    anchorTo: "end",
    followOnAppend: true,
    scrollEndThreshold: 80,
    overscan: 6,
    onChange: (instance) => setAtEnd(instance.isAtEnd()),
  });

  useLayoutEffect(() => {
    virtualizer.scrollToEnd();
    const id = requestAnimationFrame(() => virtualizer.scrollToEnd());
    return () => cancelAnimationFrame(id);
  }, [virtualizer]);

  return (
    <div className="relative flex-1 min-h-0 min-w-0 flex flex-col">
      <div
        ref={parentRef}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden min-w-0 px-3 sm:px-4"
        onScroll={(event) => {
          const { scrollTop } = event.currentTarget;
          const movingUp = scrollTop < lastScrollTopRef.current;
          lastScrollTopRef.current = scrollTop;
          if (movingUp && scrollTop >= 0 && scrollTop < 400) {
            onLoadOlder();
          }
        }}
      >
        <div
          className="relative mx-auto w-full max-w-3xl min-w-0"
          style={{ height: virtualizer.getTotalSize() }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.key}
              ref={virtualizer.measureElement}
              data-index={virtualItem.index}
              className="absolute left-0 top-0 w-full py-3 sm:py-4"
              style={{ transform: `translateY(${virtualItem.start}px)` }}
            >
              <TurnItem message={messages[virtualItem.index]!} />
            </div>
          ))}
        </div>
      </div>

      {isFetchingOlder && (
        <p className="absolute inset-x-0 top-2 text-center text-sm text-muted-foreground">
          Loading older messages...
        </p>
      )}

      {!atEnd && (
        <button
          type="button"
          aria-label="Jump to latest message"
          className="absolute bottom-4 right-4 grid size-10 place-items-center rounded-full border bg-background shadow cursor-pointer"
          onClick={() => virtualizer.scrollToEnd({ behavior: "smooth" })}
        >
          <ArrowDown className="size-4" />
        </button>
      )}
    </div>
  );
}
