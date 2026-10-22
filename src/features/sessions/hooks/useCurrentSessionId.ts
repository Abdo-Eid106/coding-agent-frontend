import { matchPath, useLocation, useParams } from "react-router-dom";

export function useCurrentSessionId(): string | undefined {
  const { sessionId } = useParams<{ sessionId?: string }>();
  const { pathname } = useLocation();

  if (sessionId) {
    return sessionId;
  }

  const match =
    matchPath("/sessions/:sessionId", pathname) ??
    matchPath("/session/:sessionId", pathname);

  return match?.params.sessionId;
}
