import { useState } from "react";
import { Check, ChevronDown, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useFetchProviders } from "@/features/providers/hooks/provider.queries";
import { type ModelDto } from "@/features/providers/types";
import { useParams } from "react-router-dom";
import { useModelStore } from "../hooks/useModelStore";

function ModelOption({ model }: { model: ModelDto }) {
  const { sessionId = "default" } = useParams<{ sessionId?: string }>();

  const selectedModelId = useModelStore((state) =>
    state.selectedModelMap.get(sessionId),
  );
  const toggleModelSelection = useModelStore(
    (state) => state.toggleModelSelection,
  );

  const selected = selectedModelId == model.id;

  return (
    <CommandItem
      value={`${model.displayName} ${model.id}`}
      onSelect={() => toggleModelSelection({ sessionId, modelId: model.id })}
      className={cn(
        "flex items-center justify-between px-3 py-2 text-sm",
        selected && "bg-accent font-medium text-accent-foreground",
      )}
    >
      <div className="mr-2 flex min-w-0 flex-col items-start">
        <span className="truncate">{model.displayName}</span>
        <span className="truncate font-mono text-[11px] text-muted-foreground">
          {model.id}
        </span>
      </div>

      {selected && <Check className="size-4 shrink-0 text-primary" />}
    </CommandItem>
  );
}

export default function ModelSelector() {
  const { sessionId = "default" } = useParams<{ sessionId?: string }>();

  const selectedModelId = useModelStore((state) =>
    state.selectedModelMap.get(sessionId),
  );
  const [isOpen, setIsOpen] = useState(false);

  const { data: providers = [], isLoading, isError } = useFetchProviders();
  const groups = providers.filter((provider) => provider.models.length > 0);
  const models = groups.flatMap((provider) => provider.models);

  const currentModel =
    models.find((model) => model.id === selectedModelId);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          role="combobox"
          aria-expanded={isOpen}
          disabled={isLoading}
          className="h-auto min-w-0 max-w-35 gap-1 px-2 py-1 text-xs font-normal text-muted-foreground sm:max-w-55"
        >
          {isLoading && (
            <Loader2 className="size-3 shrink-0 animate-spin text-primary" />
          )}

          <span className="truncate">
            {isLoading
              ? "Loading..."
              : (currentModel?.displayName ?? "Select Model")}
          </span>

          <ChevronDown
            className={cn(
              "size-3 shrink-0 transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="start"
        sideOffset={8}
        className="flex max-h-80 w-[calc(100vw-3rem)] max-w-95 flex-col overflow-hidden p-0 sm:w-80"
      >
        <div className="shrink-0 border-b px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Model
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 px-4 py-6 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin text-primary" />
              Loading configured models...
            </div>
          ) : isError ? (
            <div className="px-4 py-6 text-center text-xs text-muted-foreground">
              Failed to load models
            </div>
          ) : groups.length === 0 ? (
            <div className="px-4 py-6 text-center text-xs text-muted-foreground">
              <b className="block text-foreground">No models available</b>
              Configure an API key in Settings to enable models.
            </div>
          ) : (
            <Command>
              <CommandList className="max-h-60">
                {groups.map((provider, index) => (
                  <div key={provider.id}>
                    {index > 0 && <CommandSeparator />}
                    <CommandGroup heading={provider.displayName}>
                      {provider.models.map((model) => (
                        <ModelOption key={model.id} model={model} />
                      ))}
                    </CommandGroup>
                  </div>
                ))}
              </CommandList>
            </Command>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
