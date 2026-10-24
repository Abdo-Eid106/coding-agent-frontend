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
  onResolve: (optionId: string) => void;
  onDismiss?: () => void;
  isSubmitting?: boolean;
  className?: string;
}

export function InterruptPanel({
  interrupt,
  onResolve,
  onDismiss,
  isSubmitting = false,
  className,
}: InterruptPanelProps) {
  const [selected, setSelected] = useState("");
  const baseId = useId();

  return (
    <div
      role="group"
      aria-labelledby={baseId}
      className={cn(
        "rounded-t-xl border border-b-0 bg-muted/50 p-3",
        className,
      )}
    >
      <h3 id={baseId} className="text-xs font-medium text-foreground">
        {interrupt.question}
      </h3>

      <RadioGroup
        value={selected}
        onValueChange={setSelected}
        disabled={isSubmitting}
        aria-labelledby={baseId}
        className="mt-2 gap-0 divide-y overflow-hidden rounded-md border bg-background"
      >
        {interrupt.options.map((option) => {
          const optionId = `${baseId}-${option.id}`;
          return (
            <Label
              key={option.id}
              htmlFor={optionId}
              className="flex cursor-pointer items-start gap-2 px-2.5 py-2 text-xs font-normal transition-colors hover:bg-accent has-data-[state=checked]:bg-accent has-disabled:cursor-not-allowed has-disabled:opacity-60"
            >
              <RadioGroupItem
                id={optionId}
                value={option.id}
                className="mt-px size-3.5"
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

      <div className="mt-2 flex justify-end gap-1.5">
        {onDismiss && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 px-2.5 text-xs"
            disabled={isSubmitting}
            onClick={onDismiss}
          >
            Dismiss
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          className="h-7 px-2.5 text-xs"
          disabled={!selected || isSubmitting}
          onClick={() => onResolve(selected)}
        >
          {isSubmitting && <Loader2 className="size-3 animate-spin" />}
          Continue
        </Button>
      </div>
    </div>
  );
}

export default InterruptPanel;
