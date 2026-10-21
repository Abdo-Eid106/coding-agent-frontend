import { useEffect, useRef } from "react";

interface Props {
  dependency: unknown;
}
export function useScrollToBottom({ dependency }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [dependency]);

  return bottomRef;
}
