import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Info, Loader2 } from "lucide-react";
import { useChatStore } from "../hooks/useChatStore";
import { useFetchConfiguredProviders } from "../../settings/hooks/provider.queries";
import Dropdown from "../../main/components/Dropdown";

const formatTokens = (n: number) =>
  new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);

function Status({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-2 px-4 py-6 text-xs text-muted-foreground">
      {children}
    </div>
  );
}

type Model = {
  id: string;
  name: string;
  contextWindow?: number | null;
};

function ModelOption({
  model,
  selected,
  onSelect,
}: {
  model: Model;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm cursor-pointer transition-colors ${
        selected
          ? "bg-accent text-accent-foreground font-medium"
          : "hover:bg-accent/50"
      }`}
    >
      <div className="mr-2 flex min-w-0 flex-col items-start">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="truncate">{model.name}</span>
          {!!model.contextWindow && (
            <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
              {formatTokens(model.contextWindow)}
            </span>
          )}
        </div>
        <span className="truncate font-mono text-[11px] text-muted-foreground">
          {model.id}
        </span>
      </div>
      {selected && <Check className="size-4 shrink-0 text-primary" />}
    </button>
  );
}

export default function ModelSelector() {
  const selectedModel = useChatStore((s) => s.selectedModel);
  const selectedModelId = useChatStore((s) => s.selectedModelId);
  const setSelectedModel = useChatStore((s) => s.setSelectedModel);

  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const {
    data: providers = [],
    isLoading,
    isError,
  } = useFetchConfiguredProviders();

  const groups = providers.filter((p) => p.models.length > 0);
  const models = groups.flatMap((p) => p.models);
  const current = models.find((m) => m.id === selectedModelId) ?? models[0];

  // Keep the store in sync: fall back to the first model if the selection is gone
  useEffect(() => {
    if (!current) return;
    if (current.id !== selectedModelId || current.name !== selectedModel) {
      setSelectedModel(current.name, current.id);
    }
  }, [current, selectedModelId, selectedModel, setSelectedModel]);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  const renderBody = () => {
    if (isLoading) {
      return (
        <Status>
          <Loader2 className="size-3.5 animate-spin text-primary" />
          Loading configured models...
        </Status>
      );
    }
    if (isError) return <Status>Failed to load models</Status>;
    if (groups.length === 0) {
      return (
        <Status>
          <span className="text-center">
            <b className="block text-foreground">No models available</b>
            Configure an API key in Settings to enable models.
          </span>
        </Status>
      );
    }

    return groups.map((provider) => (
      <div key={provider.id} className="py-1">
        <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {provider.name}
        </div>
        {provider.models.map((model) => (
          <ModelOption
            key={model.id}
            model={model}
            selected={model.id === current?.id}
            onSelect={() => {
              setSelectedModel(model.name, model.id);
              setIsOpen(false);
            }}
          />
        ))}
      </div>
    ));
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        disabled={isLoading}
        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent cursor-pointer disabled:opacity-50"
      >
        {isLoading && <Loader2 className="size-3 animate-spin text-primary" />}
        <span>
          {isLoading ? "Loading..." : (current?.name ?? "Select Model")}
        </span>
        <ChevronDown
          className={`size-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <Dropdown
        isOpen={isOpen}
        direction="up"
        className="absolute bottom-full left-0 z-50 mb-2"
      >
        <div className="flex max-h-72 min-w-[320px] max-w-95 flex-col overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-lg">
          <div className="shrink-0 border-b border-border/50 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Model
          </div>
          <div className="divide-y divide-border/30 overflow-y-auto py-1">
            {renderBody()}
          </div>
          <div className="flex items-center gap-1.5 border-t border-border/50 bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
            <Info className="size-3 shrink-0" />
            Rate limits may apply based on provider quota
          </div>
        </div>
      </Dropdown>
    </div>
  );
}
