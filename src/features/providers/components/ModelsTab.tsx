import { useState } from "react";
import { Cpu, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFetchProviders } from "@/features/providers/hooks/provider.queries";
import ModelCard from "./ModelCard";

const ALL = "all";

export default function ModelsTab() {
  const { data: providers = [], isLoading } = useFetchProviders();

  const [providerFilter, setProviderFilter] = useState<string>(ALL);
  const selectedProvider = providers.find((p) => p.id === providerFilter);
  const visibleProviders = selectedProvider ? [selectedProvider] : providers;
  const totalModelsCount = providers.reduce(
    (acc, p) => acc + (p.models?.length || 0),
    0,
  );

  const models = visibleProviders.flatMap((provider) =>
    provider.models.map((model) => ({
      key: `${provider.id}:${model.id}`,
      model,
    })),
  );

  return (
    <div className="max-w-4xl space-y-5">
      {providers.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
          <Button
            type="button"
            size="sm"
            variant={providerFilter === ALL ? "secondary" : "ghost"}
            className="shrink-0 gap-1.5 cursor-pointer"
            onClick={() => setProviderFilter(ALL)}
          >
            <span>All</span>
            <Badge
              variant={providerFilter === ALL ? "default" : "outline"}
              className="text-[10px] px-1.5 py-0 h-4"
            >
              {totalModelsCount}
            </Badge>
          </Button>

          {providers.map((provider) => {
            const count = provider.models?.length || 0;
            const isSelected = providerFilter === provider.id;

            return (
              <Button
                key={provider.id}
                type="button"
                size="sm"
                variant={isSelected ? "secondary" : "ghost"}
                className="shrink-0 gap-1.5 cursor-pointer"
                onClick={() => setProviderFilter(provider.id)}
              >
                <span>{provider.displayName}</span>
                <Badge
                  variant={isSelected ? "default" : "outline"}
                  className="text-[10px] px-1.5 py-0 h-4"
                >
                  {count}
                </Badge>
              </Button>
            );
          })}
        </div>
      )}

      <div className="space-y-2.5">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-xs text-muted-foreground">
            <Loader2 className="size-4 animate-spin text-primary" />
            <span>Loading models...</span>
          </div>
        ) : models.length > 0 ? (
          models.map(({ key, model }) => <ModelCard key={key} model={model} />)
        ) : (
          <div className="space-y-2 rounded-xl border border-dashed border-border p-8 text-center">
            <Cpu className="size-8 text-muted-foreground mx-auto" />
            <p className="text-sm font-medium text-foreground">
              No models found
            </p>
            <p className="mx-auto max-w-sm text-xs text-muted-foreground">
              {selectedProvider
                ? `No models configured for ${selectedProvider.displayName}.`
                : "Add a provider with models in the Providers tab to load models."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
