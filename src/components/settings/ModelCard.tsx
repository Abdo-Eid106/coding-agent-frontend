import { Sparkles, Bot, BrainCircuit, Cpu, Check, ArrowRight } from "lucide-react";
import type { ModelInfo } from "../../store/models";

interface ModelCardProps {
  model: ModelInfo;
  isKeyConfigured: boolean;
  onNavigateToProviders: () => void;
}

function ProviderIcon({ provider }: { provider: ModelInfo["provider"] }) {
  switch (provider) {
    case "Google":
      return <Sparkles className="size-4" />;
    case "Anthropic":
      return <BrainCircuit className="size-4" />;
    case "OpenAI":
      return <Bot className="size-4" />;
    default:
      return <Cpu className="size-4" />;
  }
}

export default function ModelCard({
  model,
  isKeyConfigured,
  onNavigateToProviders,
}: ModelCardProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-card hover:bg-accent/20 transition-colors">
      <div className="flex items-start gap-3 min-w-0">
        <div className="size-9 rounded-lg border border-border bg-muted/50 flex items-center justify-center text-foreground shrink-0 mt-0.5">
          <ProviderIcon provider={model.provider} />
        </div>

        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-semibold text-foreground truncate">
              {model.name}
            </h4>

            {model.tag && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground border border-border">
                {model.tag}
              </span>
            )}

            {model.contextWindow && (
              <span className="text-[11px] text-muted-foreground">
                • {model.contextWindow}
              </span>
            )}
          </div>

          <p className="text-xs text-muted-foreground line-clamp-1">
            {model.description}
          </p>
        </div>
      </div>

      {/* Action / Status Badge */}
      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        {!model.available && (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted/40 text-muted-foreground border border-border/50">
            Unavailable
          </span>
        )}

        {model.available && isKeyConfigured && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-muted text-foreground border border-border">
            <Check className="size-3 text-muted-foreground" />
            Ready
          </span>
        )}

        {model.available && !isKeyConfigured && (
          <button
            onClick={onNavigateToProviders}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-muted text-foreground hover:bg-accent border border-border transition-colors cursor-pointer"
            title="Go to Providers to set API key"
          >
            <span>Key required</span>
            <ArrowRight className="size-3 text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  );
}
