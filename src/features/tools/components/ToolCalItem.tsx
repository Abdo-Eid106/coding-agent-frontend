import type { ComponentProps, ReactNode } from "react";
import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export interface ToolCallItemProps extends ComponentProps<typeof Collapsible> {
  header: ReactNode;
  iconPosition?: "left" | "right";
  icon?: ReactNode;
  headerClassName?: string;
  contentClassName?: string;
}

export default function ToolCallItem({
  header,
  children,
  iconPosition = "right",
  icon,
  className,
  headerClassName,
  contentClassName,
  ...props
}: ToolCallItemProps) {
  const indicator = icon ?? (
    <ChevronRight
      aria-hidden="true"
      className="size-3.5 shrink-0 text-muted-foreground/70 transition-transform duration-200 group-hover:text-foreground group-data-[state=open]:rotate-90 group-data-[state=open]:text-foreground"
    />
  );

  return (
    <Collapsible className={cn("w-full min-w-0 text-xs", className)} {...props}>
      <CollapsibleTrigger
        className={cn(
          "group flex w-full min-w-0 cursor-pointer select-none items-center gap-2 py-1 text-left font-normal text-muted-foreground transition-colors hover:text-foreground",
          "focus-visible:rounded-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          "data-[state=open]:font-medium data-[state=open]:text-foreground",
          "disabled:cursor-not-allowed disabled:opacity-50",
          headerClassName,
        )}
      >
        {iconPosition === "left" && indicator}
        <div className="min-w-0 flex-1 overflow-hidden">
          {typeof header === "string" ? (
            <span className="block truncate">{header}</span>
          ) : (
            header
          )}
        </div>
        {iconPosition === "right" && indicator}
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div
          className={cn(
            "min-w-0 overflow-hidden py-1 pl-4 text-foreground/90",
            contentClassName,
          )}
        >
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
