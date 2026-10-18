import { useEffect } from "react";
import { toast } from "sonner";

export function useSSE() {
  useEffect(() => {
    const es = new EventSource("http://localhost:3000/api/events");

    es.onmessage = (event) => alert(JSON.parse(event.data));
    es.onerror = () =>
      toast.error(
        es.readyState === EventSource.CLOSED
          ? "SSE connection closed."
          : "SSE connection lost. Reconnecting...",
      );

    return () => es.close();
  }, []);
}
