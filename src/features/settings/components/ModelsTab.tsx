import { useState, useMemo } from "react";
import { Search, Loader2 } from "lucide-react";
import { useFetchConfiguredProviders } from "../hooks/provider.queries";
import ModelCard, { type DisplayModel } from "./ModelCard";

const PROVIDER_FILTERS = ["All", "Google", "Anthropic", "OpenAI"] as const;

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

export default function ModelsTab({ onNavigateToProviders }: ModelsTabProps) {
  const [search, setSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState<string>("All");

  const { data: configuredProviders = [], isLoading } =
    useFetchConfiguredProviders();

  // Flatten models from configured providers
  const allModels: (DisplayModel & { isKeyConfigured: boolean })[] =
    useMemo(() => {
      return configuredProviders.flatMap((provider) => {
        let displayProvider = "Google";
        const pName = provider.name.toLowerCase();
        if (pName.includes("anthropic")) {
          displayProvider = "Anthropic";
        } else if (pName.includes("openai")) {
          displayProvider = "OpenAI";
        } else {
          displayProvider = "Google";
        }

        const isKeyConfigured = Boolean(provider.apiKey?.trim());

        return (provider.models || []).map((m) => ({
          id: m.id,
          name: m.name,
          apiModel: m.apiModel,
          provider: displayProvider,
          providerName: provider.name,
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
    }, [configuredProviders]);

  // Client-side filtering by provider tab and search keyword
  const filteredModels = useMemo(() => {
    return allModels.filter((model) => {
      const matchesFilter =
        providerFilter === "All" ||
        model.provider.toLowerCase() === providerFilter.toLowerCase();

      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        model.name.toLowerCase().includes(q) ||
        model.apiModel.toLowerCase().includes(q) ||
        model.provider.toLowerCase().includes(q) ||
        model.providerName.toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [allModels, providerFilter, search]);

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Search & Provider Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search models..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-card border border-input text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
            >
              ×
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {PROVIDER_FILTERS.map((prov) => (
            <button
              key={prov}
              onClick={() => setProviderFilter(prov)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                providerFilter === prov
                  ? "bg-accent text-accent-foreground border border-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              {prov}
            </button>
          ))}
        </div>
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
              {search || providerFilter !== "All"
                ? "No models match your filter criteria."
                : "No configured providers found. Add an API key in the Providers tab to load models."}
            </p>
            {!search && providerFilter === "All" && (
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
