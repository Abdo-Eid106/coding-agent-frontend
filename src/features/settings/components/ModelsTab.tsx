import { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useFetchProviders } from "@/features/providers/hooks/provider.queries";
import ModelCard, { type DisplayModel } from "./ModelCard";

interface ModelsTabProps {
  onNavigateToProviders: () => void;
}

function formatTokens(count: number): string {
  if (count >= 1_000_000) {
    const val = count / 1_000_000;
    return `${val % 1 === 0 ? val : val.toFixed(1)}M tokens`;
  }
  if (count >= 1_000) {
    const val = count / 1_000;
    return `${val % 1 === 0 ? val : val.toFixed(1)}k tokens`;
  }
  return `${count} tokens`;
}

function getProviderDisplayName(provider: { id?: string; name?: string }): string {
  const pName = (provider.name || provider.id || "").toLowerCase();
  const pId = (provider.id || "").toLowerCase();
  if (pName.includes("anthropic") || pId === "anthropic") {
    return "Anthropic";
  }
  if (pName.includes("openai") || pId === "openai") {
    return "OpenAI";
  }
  if (pName.includes("google") || pName.includes("gemini") || pId === "gemini") {
    return "Google";
  }
  return provider.name || provider.id || "Custom";
}

export default function ModelsTab({ onNavigateToProviders }: ModelsTabProps) {
  const [providerFilter, setProviderFilter] = useState<string>("All");

  const { data: providers = [], isLoading } = useFetchProviders();

  // Dynamically compute provider filters from all providers
  const providerFilters = useMemo(() => {
    const list: string[] = ["All"];
    const builtIns = ["Google", "Anthropic", "OpenAI"];
    const customNames = new Set<string>();

    for (const provider of providers) {
      const displayName = getProviderDisplayName(provider);
      if (!builtIns.includes(displayName)) {
        customNames.add(displayName);
      }
    }

    // Always include standard built-in filters first
    list.push(...builtIns);

    // Append custom provider filters
    Array.from(customNames)
      .sort((a, b) => a.localeCompare(b))
      .forEach((name) => list.push(name));

    return list;
  }, [providers]);

  // Flatten models from all providers
  const allModels: (DisplayModel & { isKeyConfigured: boolean })[] =
    useMemo(() => {
      return providers.flatMap((provider) => {
        const displayProvider = getProviderDisplayName(provider);
        const isKeyConfigured = Boolean(provider.apiKey?.trim());

        return (provider.models || []).map((m) => ({
          id: m.id,
          name: m.name,
          apiModel: m.apiModel,
          provider: displayProvider,
          providerName: provider.name || provider.id,
          providerId: provider.id,
          contextWindow: m.contextWindow
            ? formatTokens(m.contextWindow)
            : undefined,
          description: m.apiModel,
          tag: m.contextWindow ? formatTokens(m.contextWindow) : undefined,
          available: true,
          isKeyConfigured,
        }));
      });
    }, [providers]);

  // Client-side filtering by provider tab
  const filteredModels = useMemo(() => {
    return allModels.filter((model) => {
      return (
        providerFilter === "All" ||
        model.provider.toLowerCase() === providerFilter.toLowerCase() ||
        model.providerName.toLowerCase() === providerFilter.toLowerCase() ||
        model.providerId?.toLowerCase() === providerFilter.toLowerCase()
      );
    });
  }, [allModels, providerFilter]);

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Provider Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
        {providerFilters.map((prov) => (
          <button
            key={prov}
            onClick={() => setProviderFilter(prov)}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
              providerFilter === prov
                ? "bg-accent text-accent-foreground border border-border"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
          >
            {prov}
          </button>
        ))}
      </div>

      {/* Models List */}
      <div className="space-y-2.5">
        {isLoading && (
          <div className="flex items-center justify-center py-16 gap-2 text-xs text-muted-foreground">
            <Loader2 className="size-4 animate-spin text-primary" />
            <span>Loading models...</span>
          </div>
        )}

        {!isLoading &&
          filteredModels.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              isKeyConfigured={model.isKeyConfigured}
              onNavigateToProviders={onNavigateToProviders}
            />
          ))}

        {!isLoading && filteredModels.length === 0 && (
          <div className="p-8 text-center border border-dashed border-border rounded-xl space-y-2">
            <p className="text-sm font-medium text-foreground">
              No models found
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {providerFilter !== "All"
                ? `No models found for ${providerFilter}.`
                : "No models found. Add a provider or configure API keys in the Providers tab to load models."}
            </p>
            {providerFilter === "All" && (
              <button
                type="button"
                onClick={onNavigateToProviders}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Go to Providers
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
