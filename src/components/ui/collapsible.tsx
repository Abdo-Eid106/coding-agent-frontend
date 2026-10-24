import * as React from "react"
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"
import { cn } from "@/lib/utils"

function Collapsible({
  className,
  render,
  ...props
}: CollapsiblePrimitive.Root.Props) {
  return (
    <CollapsiblePrimitive.Root
      data-slot="collapsible"
      render={
        render ??
        ((rootProps, state) => (
          <div
            {...rootProps}
            data-state={state.open ? "open" : "closed"}
          />
        ))
      }
      className={cn("w-full", className)}
      {...props}
    />
  )
}

function CollapsibleTrigger({
  className,
  asChild,
  children,
  render,
  ...props
}: CollapsiblePrimitive.Trigger.Props & { asChild?: boolean }) {
  if (asChild && React.isValidElement(children)) {
    return (
      <CollapsiblePrimitive.Trigger
        data-slot="collapsible-trigger"
        render={(triggerProps, state) =>
          React.cloneElement(children, {
            ...triggerProps,
            "data-state": state.open ? "open" : "closed",
          } as React.HTMLAttributes<HTMLElement>)
        }
        {...props}
      />
    )
  }

  return (
    <CollapsiblePrimitive.Trigger
      data-slot="collapsible-trigger"
      render={
        render ??
        ((triggerProps, state) => (
          <button
            type="button"
            {...triggerProps}
            data-state={state.open ? "open" : "closed"}
          />
        ))
      }
      className={cn("cursor-pointer", className)}
      {...props}
    >
      {children}
    </CollapsiblePrimitive.Trigger>
  )
}

function CollapsibleContent({
  className,
  children,
  render,
  ...props
}: CollapsiblePrimitive.Panel.Props) {
  return (
    <CollapsiblePrimitive.Panel
      data-slot="collapsible-content"
      render={
        render ??
        ((panelProps, state) => (
          <div
            {...panelProps}
            data-state={state.open ? "open" : "closed"}
          />
        ))
      }
      className={cn(
        "h-(--collapsible-panel-height) overflow-hidden transition-[height,opacity] duration-200 ease-out",
        "data-[starting-style]:h-0 data-[starting-style]:opacity-0",
        "data-[ending-style]:h-0 data-[ending-style]:opacity-0",
        className
      )}
      {...props}
    >
      {children}
    </CollapsiblePrimitive.Panel>
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
