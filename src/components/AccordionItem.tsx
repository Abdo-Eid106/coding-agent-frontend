import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../shared/lib/cn";

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
      className={cn(
        "size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-in-out group-hover:text-foreground",
        isOpen && "rotate-180 text-foreground",
      )}
    />
  );

  const resolvedIcon = typeof icon === "function" ? icon(isOpen) : icon;
  const iconNode = icon === undefined ? defaultIcon : resolvedIcon;

  const headerContent =
    typeof header === "string" ? (
      <span className="truncate">{header}</span>
    ) : (
      header
    );

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card text-card-foreground transition-colors",
        disabled && "opacity-60",
        className,
      )}
    >
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        aria-expanded={isOpen}
        className={cn(
          "group flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-foreground transition-colors",
          "hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:hover:bg-transparent",
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
          "grid transition-[grid-template-rows,opacity] duration-200 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div
            className={cn(
              "border-t border-border/60 px-4 py-3 text-sm text-foreground/90",
              contentClassName,
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export { AccordionItem };
