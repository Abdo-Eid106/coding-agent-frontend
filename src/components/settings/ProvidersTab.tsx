import ProviderCard from "./ProviderCard";
import { PROVIDERS_CONFIG } from "./types";

interface ProvidersTabProps {
  savedKeys: Record<string, string>;
  onSaveKey: (providerId: string, key: string) => void;
  onClearKey: (providerId: string) => void;
}

export default function ProvidersTab({
  savedKeys,
  onSaveKey,
  onClearKey,
}: ProvidersTabProps) {
  return (
    <div className="space-y-6 max-w-3xl">
      {PROVIDERS_CONFIG.map((provider) => (
        <ProviderCard
          key={provider.id}
          provider={provider}
          savedKey={savedKeys[provider.id] || ""}
          onSave={onSaveKey}
          onClear={onClearKey}
        />
      ))}
    </div>
  );
}
