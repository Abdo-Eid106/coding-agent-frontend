import { useCallback } from "react";
import { useUIStore } from "../../hooks/useUIStore";

const MOBILE_QUERY = "(max-width: 767px)"; // matches Tailwind's md breakpoint

export function useCloseSidebarOnMobile() {
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);

  return useCallback(() => {
    if (window.matchMedia(MOBILE_QUERY).matches) setSidebarOpen(false);
  }, [setSidebarOpen]);
}
