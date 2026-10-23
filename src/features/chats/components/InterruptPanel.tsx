import { useId, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export type InterruptOption = {
  id: string;
  label: string;
  description?: string;
};

export type Interrupt = {
  question: string;
  options: InterruptOption[];
};

export interface InterruptPanelProps {
  interrupt: Interrupt;
  /** Called with the id of the selected option when the user confirms. */
  onResolve: (optionId: string) => void;
  /** When provided, a Dismiss button is shown. */
  onDismiss?: () => void;
  /** Disables the controls and shows a spinner while the answer is being sent. */
  isSubmitting?: boolean;
  className?: string;
}

/**
 * Renders directly above the chat composer and visually attaches to it.
 * The composer below should drop its top radius and be disabled while this
 * panel is mounted.
 *
 * Mount it with `key={interrupt.id}` (or similar) so the selection resets
 * when a new interrupt arrives.
 */
export function InterruptPanel({
  interrupt,
  onResolve,
  onDismiss,
  isSubmitting = false,
  className,
}: InterruptPanelProps) {
  const [selected, setSelected] = useState("");
  const titleId = useId();

  return (
    <div
      role="group"
      aria-labelledby={titleId}
      className={cn(
        "rounded-t-xl border border-b-0 border-border bg-muted/50 p-4",
        className,
      )}
    >
      <h3 id={titleId} className="text-sm font-semibold text-foreground">
        {interrupt.question}
      </h3>

      <RadioGroup
        value={selected}
        onValueChange={setSelected}
        disabled={isSubmitting}
        aria-labelledby={titleId}
        className="mt-3 gap-0 divide-y divide-border overflow-hidden rounded-lg border border-border bg-background"
      >
        {interrupt.options.map((option) => {
          const inputId = `${titleId}-${option.id}`;
          const isChecked = selected === option.id;
          return (
            <Label
              key={option.id}
              htmlFor={inputId}
              className={cn(
                "flex cursor-pointer items-start gap-3 px-3 py-2.5 text-sm font-normal transition-colors",
                "hover:bg-accent has-[[data-state=checked]]:bg-accent has-[[data-checked]]:bg-accent",
                isChecked && "bg-accent",
                "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60",
              )}
            >
              <RadioGroupItem
                id={inputId}
                value={option.id}
                className="mt-0.5"
              />
              <span className="flex flex-col gap-0.5">
                <span className="text-foreground">{option.label}</span>
                {option.description && (
                  <span className="text-muted-foreground">
                    {option.description}
                  </span>
                )}
              </span>
            </Label>
          );
        })}
      </RadioGroup>

      <div className="mt-3 flex justify-end gap-2">
        {onDismiss && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isSubmitting}
            onClick={onDismiss}
          >
            Dismiss
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          disabled={!selected || isSubmitting}
          onClick={() => onResolve(selected)}
        >
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          Continue
        </Button>
      </div>
    </div>
  );
}

export default InterruptPanel;
