import { useId, useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useResumeInterrupt } from "../hooks/useMessages";
import { useInterruptsStore } from "../hooks/useInterruptStore";

interface Props {
  messageId: string;
}

export function InterruptPanel({ messageId }: Props) {
  const interrupt = useInterruptsStore((store) =>
    store.getInterrupt(messageId),
  );

  const removeInterrupt = useInterruptsStore((store) => store.removeInterrupt);
  const [selected, setSelected] = useState("");
  const baseId = useId();

  const { mutate: resumeInterrupt, isPending } = useResumeInterrupt();
  if (!interrupt) return null;

  return (
    <div
      role="group"
      aria-labelledby={baseId}
      className={cn("rounded-t-xl border border-b-0 bg-muted/50 p-3")}
    >
      <h3 id={baseId} className="text-xs font-medium text-foreground">
        {interrupt.payload.message}
      </h3>

      <RadioGroup
        value={selected}
        onValueChange={setSelected}
        disabled={isPending}
        aria-labelledby={baseId}
        className="mt-2 gap-0 divide-y overflow-hidden rounded-md border bg-background"
      >
        {interrupt.payload.options.map((option) => {
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
                {option.label && (
                  <span className="text-muted-foreground">{option.label}</span>
                )}
              </span>
            </Label>
          );
        })}
      </RadioGroup>

      <div className="mt-2 flex justify-end gap-1.5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2.5 text-xs"
          disabled={isPending}
          onClick={() => removeInterrupt(messageId)}
        >
          Dismiss
        </Button>

        <Button
          type="button"
          size="sm"
          className="h-7 px-2.5 text-xs"
          disabled={!selected || isPending}
          onClick={() =>
            resumeInterrupt({
              messageId,
              interruptId: interrupt.interruptId,
              payload: { selectedId: selected },
            })
          }
        >
          {isPending && <Loader2 className="size-3 animate-spin" />}
          Continue
        </Button>
      </div>
    </div>
  );
}

export default InterruptPanel;
