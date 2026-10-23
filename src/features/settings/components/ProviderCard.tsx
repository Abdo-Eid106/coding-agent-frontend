import {
  ExternalLink,
  Trash2,
  Pencil,
  Sparkles,
  Bot,
  BrainCircuit,
  Globe,
  Check,
} from "lucide-react";
import type { ProviderDto } from "@/features/providers/types";

interface ProviderCardProps {
  provider: ProviderDto;
  onEdit: (provider: ProviderDto) => void;
  onDelete: (provider: ProviderDto) => void;
}

function ProviderIcon({ id }: { id: string }) {
  const lower = id.toLowerCase();
  if (lower.includes("gemini") || lower.includes("google")) {
    return <Sparkles className="size-5" />;
  }
  if (lower.includes("openai")) {
    return <Bot className="size-5" />;
  }
  if (lower.includes("anthropic") || lower.includes("claude")) {
    return <BrainCircuit className="size-5" />;
  }
  return <Globe className="size-5" />;
}

export default function ProviderCard({
  provider,
  onEdit,
  onDelete,
}: ProviderCardProps) {
  const isConfigured = Boolean(provider.apiKey?.trim());
  const modelsCount = provider.models?.length || 0;
  const modelsList =
    provider.models && provider.models.length > 0
      ? provider.models.map((m) => m.displayName || m.id).join(", ")
      : "No models configured";

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-10 rounded-lg flex items-center justify-center border border-border bg-muted/50 text-foreground shrink-0">
            <ProviderIcon id={provider.id} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-semibold text-foreground truncate">
                {provider.displayName}
              </h3>
              {isConfigured ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted text-foreground border border-border">
                  <Check className="size-3 text-primary" />
                  Key configured
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted/40 text-muted-foreground border border-border/50">
                  No API key
                </span>
              )}
              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted/30 text-muted-foreground border border-border/40">
                {modelsCount} {modelsCount === 1 ? "model" : "models"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 truncate font-mono">
              {provider.baseUrl || "Endpoint"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 mt-1">
          {provider.baseUrl && provider.baseUrl !== "#" && (
            <a
              href={provider.baseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              title="Open endpoint URL"
            >
              <span>Endpoint</span>
              <ExternalLink className="size-3" />
            </a>
          )}

          <button
            type="button"
            onClick={() => onEdit(provider)}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            title="Edit provider"
          >
            <Pencil className="size-3" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            onClick={() => onDelete(provider)}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive cursor-pointer transition-colors"
            title="Delete provider"
          >
            <Trash2 className="size-3" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Models preview */}
      <div className="text-xs text-muted-foreground pt-1 border-t border-border/40">
        <span className="font-medium text-foreground/80">Models: </span>
        <span className="line-clamp-1">{modelsList}</span>
      </div>
    </div>
  );
}
