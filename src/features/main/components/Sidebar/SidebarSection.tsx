import type { ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

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
  const Chevron = open ? ChevronDown : ChevronRight;

  return (
    <section>
      <div className="flex items-center justify-between mb-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex flex-1 items-center gap-1.5 px-2 py-1 cursor-pointer select-none"
        >
          <Chevron className="size-3.5 shrink-0" />
          <span className="text-[11px] font-semibold uppercase tracking-wider">
            {title}
          </span>
        </button>

        {action && <div className="pr-1">{action}</div>}

        {!!count && (
          <span className="mr-2 text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border shrink-0">
            {count}
          </span>
        )}
      </div>

      {open && <div className="space-y-1">{children}</div>}
    </section>
  );
}
