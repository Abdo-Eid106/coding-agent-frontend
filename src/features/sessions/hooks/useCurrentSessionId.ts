import { useLocation } from "react-router-dom";

export function useCurrentSessionId(): string | undefined {
  const { pathname } = useLocation();
  const match = pathname.match(/^\/sessions?\/([^/?#]+)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}
