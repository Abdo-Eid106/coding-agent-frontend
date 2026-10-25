import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useFetchSettings, useUpdateSettings } from "../hooks/settings.queries";
import { CommandApprovalMode } from "../types";

const OPTION_META: Record<
  CommandApprovalMode,
  { label: string; description: string }
> = {
  [CommandApprovalMode.ALWAYS_ASK]: {
    label: "Ask before every command",
    description: "You approve each command before it runs.",
  },
  [CommandApprovalMode.ASK_UNLESS_ALLOWLISTED]: {
    label: "Ask unless on my safe list",
    description:
      "Read-only and allowlisted commands run automatically. Everything else asks first.",
  },
  [CommandApprovalMode.NEVER_ASK]: {
    label: "Run commands automatically",
    description:
      "The agent runs every command without asking. Use only in a sandbox or a repo you can restore.",
  },
};

const OPTIONS = Object.values(CommandApprovalMode).map((value) => ({
  value,
  ...OPTION_META[value],
}));

export function CommandApprovalSelect() {
  const [open, setOpen] = useState(false);
  const { data, isError, refetch } = useFetchSettings();
  const { mutate, isPending } = useUpdateSettings();

  const selected = data?.commandApprovalMode;
  const current = selected ? OPTION_META[selected] : undefined;

  const handleSelect = (value: CommandApprovalMode) => {
    setOpen(false);
    if (value !== selected) mutate({ commandApprovalMode: value });
  };

  return (
    <div className="grid w-full max-w-md gap-2">
      <Label htmlFor="command-approval">Command approval</Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              id="command-approval"
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              disabled={!data || isPending}
              className="w-full justify-between font-normal cursor-pointer"
            />
          }
        >
          <span className={cn(!current && "text-muted-foreground")}>
            {current?.label ?? (isError ? "Failed to load" : "Loading…")}
          </span>
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-(--anchor-width) min-w-80 p-0"
        >
          <Command>
            <CommandList>
              <CommandGroup>
                {OPTIONS.map((o) => (
                  <CommandItem
                    key={o.value}
                    value={o.value}
                    onSelect={() => handleSelect(o.value)}
                    className="items-start gap-2 py-2 cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mt-0.5 size-4 shrink-0",
                        selected === o.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <div className="grid gap-0.5">
                      <span className="text-sm font-medium">{o.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {o.description}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {isError && (
        <p className="text-sm text-destructive">
          Couldn't load your settings.{" "}
          <button type="button" className="underline" onClick={() => refetch()}>
            Retry
          </button>
        </p>
      )}
    </div>
  );
}
