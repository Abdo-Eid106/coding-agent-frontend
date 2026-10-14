import { useState } from "react";
import { Lock, Eye, EyeOff, Check, ExternalLink, Trash2 } from "lucide-react";
import type { ProviderConfig } from "./types";

interface ProviderCardProps {
  provider: ProviderConfig;
  savedKey: string;
  onSave: (providerId: string, key: string) => void;
  onClear: (providerId: string) => void;
}

export default function ProviderCard({
  provider,
  savedKey,
  onSave,
  onClear,
}: ProviderCardProps) {
  const [currentValue, setCurrentValue] = useState(savedKey);
  const [showKey, setShowKey] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  // Sync if savedKey changes externally
  if (savedKey !== currentValue && !currentValue) {
    setCurrentValue(savedKey);
  }

  const isConfigured = Boolean(savedKey.trim());
  const isDirty = currentValue.trim() !== savedKey.trim();
  const Icon = provider.icon;

  const handleSave = () => {
    onSave(provider.id, currentValue);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  const handleClear = () => {
    setCurrentValue("");
    onClear(provider.id);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg flex items-center justify-center border border-border bg-muted/50 text-foreground shrink-0">
            <Icon className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-foreground">
                {provider.name}
              </h3>
              {isConfigured ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted text-foreground border border-border">
                  <Check className="size-3 text-muted-foreground" />
                  Configured
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted/40 text-muted-foreground border border-border/50">
                  Not set
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {provider.tagline} • <span>{provider.models}</span>
            </p>
          </div>
        </div>

        <a
          href={provider.docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground shrink-0 mt-1 cursor-pointer transition-colors"
        >
          <span>Get key</span>
          <ExternalLink className="size-3" />
        </a>
      </div>

      {/* Input Row */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor={`key-${provider.id}`}
            className="text-xs font-medium text-foreground flex items-center gap-1.5"
          >
            <Lock className="size-3 text-muted-foreground" />
            API Key
          </label>
          {isConfigured && (
            <button
              type="button"
              onClick={handleClear}
              className="text-[11px] text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 className="size-3" />
              Remove
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 flex items-center">
            <input
              id={`key-${provider.id}`}
              type={showKey ? "text" : "password"}
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
              }}
              placeholder={provider.placeholder}
              autoComplete="new-password"
              spellCheck={false}
              className="w-full pl-3 pr-10 py-2 rounded-lg bg-background border border-input text-foreground text-sm font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring focus:border-input transition-colors"
            />

            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              className="absolute right-2.5 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
              title={showKey ? "Hide API key" : "Show API key"}
            >
              {showKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty}
            className="px-3.5 py-2 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
          >
            {justSaved ? (
              <>
                <Check className="size-3.5" />
                <span>Saved</span>
              </>
            ) : (
              <span>Save</span>
            )}
          </button>
        </div>

        <p className="text-[11px] text-muted-foreground">
          Keys are stored securely in your browser's local storage and used directly for requests.
        </p>
      </div>
    </div>
  );
}
