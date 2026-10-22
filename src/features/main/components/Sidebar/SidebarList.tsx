import type { ReactNode } from "react";

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
  loadingText,
  emptyText,
  renderItem,
}: SidebarListProps<T>) {
  if (isLoading) {
    return (
      <div className="px-2 py-3 text-muted-foreground animate-pulse">
        {loadingText}
      </div>
    );
  }

  if (items.length === 0) {
    return <div className="px-2 py-2 text-muted-foreground">{emptyText}</div>;
  }

  return <>{items.map(renderItem)}</>;
}
