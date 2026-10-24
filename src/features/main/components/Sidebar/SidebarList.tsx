import type { ReactNode } from "react";
import { SidebarMenuSkeleton } from "@/components/ui/sidebar";

interface SidebarListProps<T extends { id: string }> {
  items: T[];
  isLoading: boolean;
  loadingText: string;
  emptyText: string;
  renderItem: (item: T) => ReactNode;
}

export default function SidebarList<T extends { id: string }>({
  items,
  isLoading,
  loadingText: _loadingText,
  emptyText,
  renderItem,
}: SidebarListProps<T>) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-1 py-1">
        <SidebarMenuSkeleton showIcon />
        <SidebarMenuSkeleton showIcon />
        <SidebarMenuSkeleton showIcon />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="px-2 py-2 text-xs text-muted-foreground select-none">
        {emptyText}
      </div>
    );
  }

  return <>{items.map(renderItem)}</>;
}
