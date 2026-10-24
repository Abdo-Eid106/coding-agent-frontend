import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { cn } from "cn";

interface SidebarSectionProps {
  title: string;
  open: boolean;
  onToggle: () => void;
  count?: number;
  action?: ReactNode;
  children: ReactNode;
}

export default function SidebarSection({
  title,
  open,
  onToggle,
  count,
  action,
  children,
}: SidebarSectionProps) {
  return (
    <SidebarGroup className="p-0">
      <div className="flex items-center justify-between">
        <SidebarGroupLabel
          render={
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={open}
              className="flex flex-1 items-center gap-1.5 cursor-pointer select-none text-muted-foreground hover:text-sidebar-foreground transition-colors p-0 h-7"
            />
          }
        >
          <ChevronRight
            className={cn(
              "size-3.5 shrink-0 transition-transform duration-200 ease-in-out",
              open && "rotate-90",
            )}
          />
          <span className="text-[11px] font-semibold uppercase tracking-wider">
            {title}
          </span>
          {count !== undefined && (
            <Badge
              variant="secondary"
              className="ml-auto mr-1 h-4 px-1.5 text-[10px] font-mono text-muted-foreground"
            >
              {count}
            </Badge>
          )}
        </SidebarGroupLabel>

        {action && <div className="shrink-0">{action}</div>}
      </div>

      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-200 ease-in-out",
          open
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0 pointer-events-none",
        )}
      >
        <div className="overflow-hidden">
          <SidebarGroupContent className="mt-1">
            <SidebarMenu className="gap-0.5">{children}</SidebarMenu>
          </SidebarGroupContent>
        </div>
      </div>
    </SidebarGroup>
  );
}
