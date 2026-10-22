import { useEffect } from "react";
import { toast } from "sonner";
import { useFetchMessages } from "../hooks/useMessages";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { useScrollToBottom } from "../hooks/useScrollToBottom";
import TurnItem from "./TurnItem";

interface MessageListProps {
  sessionId?: string;
}

export default function MessagesList({ sessionId }: MessageListProps) {
  const {
    data,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useFetchMessages(sessionId);

  const messages = data?.pages.toReversed().flatMap((page) => page.items) ?? [];

  const topRef = useInfiniteScroll({
    onLoadMore: () => {
      if (hasNextPage && !isFetchingNextPage) {
        void fetchNextPage();
      }
    },
    hasMore: !!hasNextPage,
    isLoading: isFetchingNextPage,
  });

  const lastMessageId = messages.at(-1)?.id;
  const bottomRef = useScrollToBottom({ dependency: lastMessageId });

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

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 px-3 sm:px-4 py-4 sm:py-6">
      {hasNextPage && <div ref={topRef} className="h-4" aria-hidden="true" />}

      <div className="mx-auto max-w-3xl w-full min-w-0 space-y-6 sm:space-y-8 pb-4">
        {messages.map((message) => (
          <TurnItem key={message.id} message={message} />
        ))}

        {isFetchingNextPage && (
          <p className="text-center text-sm text-muted-foreground">
            Loading older messages...
          </p>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
