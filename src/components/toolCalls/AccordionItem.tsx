import { Children, useState, type ReactNode } from "react";
import { ChevronDown, Wrench } from "lucide-react";
import { cn } from "../../shared/lib/cn";

/* -------------------------------------------------------------------------- */
/*                                AccordionItem                               */
/* -------------------------------------------------------------------------- */

export interface AccordionItemProps {
  /** The header content. Can be plain text or a custom React component. */
  header: ReactNode;

  /** The content revealed when the accordion item expands. */
  children: ReactNode;

  /**
   * Initial open state when used as an uncontrolled component.
   * @default false
   */
  defaultOpen?: boolean;

  /** Controlled open state. */
  isOpen?: boolean;

  /** Callback fired whenever the open state toggles. */
  onToggle?: (isOpen: boolean) => void;

  /**
   * Whether the item is disabled and cannot be toggled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Placement of the expand/collapse indicator icon.
   * @default "right"
   */
  iconPosition?: "left" | "right";

  /**
   * Custom icon replacing the default Lucide ChevronDown.
   * Can be a ReactNode or a render function receiving the current `isOpen` state.
   */
  icon?: ReactNode | ((isOpen: boolean) => ReactNode);

  /** Additional classes for the outermost wrapper element. */
  className?: string;

  /** Additional classes for the header toggle button. */
  headerClassName?: string;

  /** Additional classes for the inner content container. */
  contentClassName?: string;
}

const styles = {
  wrapper:
    "rounded-lg border border-border bg-card text-card-foreground transition-colors",
  button: cn(
    "group flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm font-medium text-foreground transition-colors",
    "hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
    "disabled:cursor-not-allowed disabled:hover:bg-transparent",
  ),
  chevron:
    "size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-in-out group-hover:text-foreground",
  // CSS Grid trick for smooth height expand/collapse
  panel:
    "grid transition-[grid-template-rows,opacity] duration-200 ease-in-out",
  content: "border-t border-border/60 px-4 py-3 text-sm text-foreground/90",
};

/**
 * A customizable, accessible accordion item styled with shadcn design tokens
 * and Lucide icons. Works controlled (`isOpen`) or uncontrolled (`defaultOpen`).
 */
export default function AccordionItem({
  header,
  children,
  defaultOpen = false,
  isOpen: controlledOpen,
  onToggle,
  disabled = false,
  iconPosition = "right",
  icon,
  className,
  headerClassName,
  contentClassName,
}: AccordionItemProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const handleToggle = () => {
    if (disabled) return;

    const next = !isOpen;
    if (!isControlled) setUncontrolledOpen(next);
    onToggle?.(next);
  };

  const defaultIcon = (
    <ChevronDown
      aria-hidden="true"
      className={cn(styles.chevron, isOpen && "rotate-180 text-foreground")}
    />
  );
  const customIcon = typeof icon === "function" ? icon(isOpen) : icon;
  const iconNode = icon === undefined ? defaultIcon : customIcon;

  const headerContent =
    typeof header === "string" ? (
      <span className="truncate">{header}</span>
    ) : (
      header
    );

  return (
    <div className={cn(styles.wrapper, disabled && "opacity-60", className)}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        aria-expanded={isOpen}
        className={cn(
          styles.button,
          isOpen ? "rounded-t-lg" : "rounded-lg",
          headerClassName,
        )}
      >
        {iconPosition === "left" && iconNode}
        <div className="min-w-0 flex-1">{headerContent}</div>
        {iconPosition === "right" && iconNode}
      </button>

      <div
        className={cn(
          styles.panel,
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className={cn(styles.content, contentClassName)}>{children}</div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Accordion                                  */
/* -------------------------------------------------------------------------- */

export interface AccordionProps {
  /** The tool call components to group, e.g. a list of `EditFileToolCall`. */
  children: ReactNode;

  /**
   * Whether the group starts expanded.
   * @default false
   */
  defaultOpen?: boolean;
}

/**
 * Collapsible wrapper that groups multiple tool calls under one header
 * showing how many there are.
 */
export function Accordion({ children, defaultOpen = false }: AccordionProps) {
  // toArray drops null/false children, so `{cond && <Call />}` isn't counted
  const count = Children.toArray(children).length;
  if (count === 0) return null;

  const header = (
    <div className="flex items-center gap-2">
      <Wrench
        className="size-4 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <span>
        {count} tool {count === 1 ? "call" : "calls"}
      </span>
    </div>
  );

  return (
    <AccordionItem
      header={header}
      defaultOpen={defaultOpen}
      contentClassName="space-y-2"
    >
      {children}
    </AccordionItem>
  );
}

export { AccordionItem };
