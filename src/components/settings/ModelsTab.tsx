import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { AVAILABLE_MODELS } from "../../store/models";
import ModelCard from "./ModelCard";

const PROVIDER_FILTERS = ["All", "Google", "Anthropic", "OpenAI", "Open Source"] as const;

interface ModelsTabProps {
  savedKeys: Record<string, string>;
  onNavigateToProviders: () => void;
}

export default function ModelsTab({
  savedKeys,
  onNavigateToProviders,
}: ModelsTabProps) {
  const [search, setSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState<string>("All");

  const filteredModels = useMemo(() => {
    return AVAILABLE_MODELS.filter((model) => {
      const matchesFilter =
        providerFilter === "All" || model.provider === providerFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        model.name.toLowerCase().includes(q) ||
        (model.tag && model.tag.toLowerCase().includes(q)) ||
        (model.description && model.description.toLowerCase().includes(q));

      return matchesFilter && matchesSearch;
    });
  }, [providerFilter, search]);

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
        {filteredModels.map((model) => {
          const isKeyConfigured = model.providerId
            ? Boolean(savedKeys[model.providerId]?.trim())
            : true;

          return (
            <ModelCard
              key={model.id}
              model={model}
              isKeyConfigured={isKeyConfigured}
              onNavigateToProviders={onNavigateToProviders}
            />
          );
        })}

        {filteredModels.length === 0 && (
          <div className="p-8 text-center border border-dashed border-border rounded-xl">
            <p className="text-xs text-muted-foreground">
              No models found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
