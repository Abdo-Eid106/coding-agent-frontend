import { useEffect } from "react";
import { toast } from "sonner";
import { agentHandlers, handleAgentError } from "./messages.queries";
import { useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export function useSSE() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const es = new EventSource(`${API_URL}/events`);

    Object.entries(agentHandlers).forEach(([type, handler]) => {
      es.addEventListener(type, (e) => {
        handler(queryClient, JSON.parse((e as MessageEvent).data));
      });
    });

    // "error" is used by both the server and the browser
    es.addEventListener("error", (e) => {
      const msg = e as MessageEvent;

      if (typeof msg.data === "string") {
        handleAgentError(JSON.parse(msg.data));
        return;
      }

      toast.error(
        es.readyState === EventSource.CLOSED
          ? "SSE connection closed."
          : "SSE connection lost. Reconnecting...",
      );
    });

    return () => es.close();
  }, [queryClient]);
}
