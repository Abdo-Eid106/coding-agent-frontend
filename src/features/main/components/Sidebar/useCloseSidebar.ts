import { useCallback } from "react";
import { useSidebar } from "@/components/ui/sidebar";

export function useCloseSidebarOnMobile() {
  const { isMobile, setOpenMobile } = useSidebar();

  return useCallback(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, setOpenMobile]);
}
