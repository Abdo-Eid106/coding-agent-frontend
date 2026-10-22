import { Children, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../../shared/lib/cn";

/* ------------------------------ Shared helpers ----------------------------- */

interface DisclosureProps {
  /** Initial open state (uncontrolled). @default false */
  defaultOpen?: boolean;
  /** Controlled open state. */
  isOpen?: boolean;
  /** Fired whenever the open state toggles. */
  onToggle?: (isOpen: boolean) => void;
}

/** Supports both controlled (`isOpen`) and uncontrolled (`defaultOpen`) usage. */
function useDisclosure({
  defaultOpen = false,
  isOpen: controlled,
  onToggle,
}: DisclosureProps) {
  const [internal, setInternal] = useState(defaultOpen);
  const isOpen = controlled ?? internal;

  const toggle = () => {
    const next = !isOpen;
    if (controlled === undefined) setInternal(next);
    onToggle?.(next);
  };

  return [isOpen, toggle] as const;
}

/** Smooth height expand/collapse using the CSS grid-rows trick. */
function Collapsible({
  open,
  children,
}: {
  open: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-200 ease-in-out",
        open
          ? "grid-rows-[1fr] opacity-100"
          : "grid-rows-[0fr] opacity-0 pointer-events-none",
      )}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}

/* ------------------------------ AccordionItem ------------------------------ */

export interface AccordionItemProps extends DisclosureProps {
  /** Header content: plain text or a custom component. */
  header: ReactNode;
  /** Content revealed when expanded. */
  children: ReactNode;
  /** Prevents toggling. @default false */
  disabled?: boolean;
  /** Placement of the indicator icon. @default "right" */
  iconPosition?: "left" | "right";
  /** Custom icon (node, or render function receiving `isOpen`). */
  icon?: ReactNode | ((isOpen: boolean) => ReactNode);
  /** Classes for the outer wrapper. */
  className?: string;
  /** Classes for the header button. */
  headerClassName?: string;
  /** Classes for the content container. */
  contentClassName?: string;
}

export default function AccordionItem({
  header,
  children,
  disabled = false,
  iconPosition = "right",
  icon,
  className,
  headerClassName,
  contentClassName,
  ...disclosure
}: AccordionItemProps) {
  const [isOpen, toggle] = useDisclosure(disclosure);

  const iconNode =
    icon === undefined ? (
      <ChevronDown
        aria-hidden="true"
        className={cn(
          "size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ease-in-out group-hover:text-foreground",
          isOpen && "rotate-180 text-foreground",
        )}
      />
    ) : typeof icon === "function" ? (
      icon(isOpen)
    ) : (
      icon
    );

  return (
    <div
      className={cn(
        "text-xs transition-colors w-full min-w-0",
        disabled && "opacity-60",
        className,
      )}
    >
      <button
        type="button"
        onClick={toggle}
        disabled={disabled}
        aria-expanded={isOpen}
        className={cn(
          "group flex w-full min-w-0 cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-left font-medium text-muted-foreground transition-colors",
          "hover:bg-accent/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:hover:bg-transparent",
          isOpen && "bg-accent/20 text-foreground",
          headerClassName,
        )}
      >
        {iconPosition === "left" && iconNode}
        <div className="min-w-0 flex-1 overflow-hidden">
          {typeof header === "string" ? (
            <span className="truncate block">{header}</span>
          ) : (
            header
          )}
        </div>
        {iconPosition === "right" && iconNode}
      </button>

      <Collapsible open={isOpen}>
        <div className={cn("px-2 py-1.5 text-foreground/90 min-w-0 overflow-hidden", contentClassName)}>
          {children}
        </div>
      </Collapsible>
    </div>
  );
}

/* -------------------------------- Accordion -------------------------------- */

export interface AccordionProps extends DisclosureProps {
  /** The tool calls to group. */
  children: ReactNode;
  /** Trigger title. Defaults to `${count} tool call(s)`. */
  title?: ReactNode;
  /** Optional icon before the title. */
  icon?: ReactNode;
  /** Classes for the outer wrapper. */
  className?: string;
}

/** Unboxed collapsible trigger that groups multiple tool calls. */
export function Accordion({
  children,
  title,
  icon,
  className,
  ...disclosure
}: AccordionProps) {
  const [isOpen, toggle] = useDisclosure(disclosure);
  const count = Children.count(children);

  if (count === 0) return null;

  return (
    <div className={cn("text-xs w-full min-w-0", className)}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        className="group -ml-1.5 inline-flex cursor-pointer select-none items-center gap-1.5 rounded-md px-1.5 py-1 font-medium text-inherit transition-colors hover:bg-accent/40 hover:text-foreground"
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span>
          {title ?? `${count} tool ${count === 1 ? "call" : "calls"}`}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:text-foreground",
            !isOpen && "-rotate-90",
          )}
        />
      </button>

      <Collapsible open={isOpen}>
        <div className="space-y-1 pt-1 min-w-0 w-full overflow-hidden">{children}</div>
      </Collapsible>
    </div>
  );
}

export { AccordionItem };
