import { Children, type ComponentProps, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export interface ToolCallGroupProps extends Omit<
  ComponentProps<typeof Collapsible>,
  "title"
> {
  title?: ReactNode;
  icon?: ReactNode;
}

export default function ToolCallGroup({
  children,
  title,
  icon,
  className,
  ...props
}: ToolCallGroupProps) {
  const count = Children.toArray(children).length;
  if (count === 0) return null;

  return (
    <Collapsible className={cn("w-full min-w-0 text-xs", className)} {...props}>
      <CollapsibleTrigger className="group inline-flex cursor-pointer select-none items-center gap-1.5 py-1 text-left font-normal text-muted-foreground transition-colors hover:text-foreground focus-visible:rounded-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
        {icon && <span className="shrink-0">{icon}</span>}
        <span>
          {title ?? `${count} tool ${count === 1 ? "call" : "calls"}`}
        </span>
        <ChevronRight
          aria-hidden="true"
          className="size-3.5 shrink-0 text-muted-foreground/70 transition-transform duration-200 group-hover:text-foreground group-data-[state=open]:rotate-90 group-data-[state=open]:text-foreground"
        />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="w-full min-w-0 space-y-1 overflow-hidden pl-3 pt-1">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
