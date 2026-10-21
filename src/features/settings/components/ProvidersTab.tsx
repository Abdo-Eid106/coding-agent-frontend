import { useState } from "react";
import { Loader2 } from "lucide-react";
import ProviderCard from "./ProviderCard";
import { PROVIDERS_CONFIG } from "../types";
import {
  useFetchConfiguredProviders,
  useAddProviderApiKey,
  useRemoveProviderApiKey,
} from "../hooks/provider.queries";
import { toast } from "../../main/components/Toaster";
import { getErrorMessage } from "../../../shared/lib/get-error-message";

export default function ProvidersTab() {
  const { data: configuredProviders = [], isLoading } =
    useFetchConfiguredProviders();
  const { mutate: addApiKey, isPending: isSaving } = useAddProviderApiKey();
  const { mutate: removeApiKey } = useRemoveProviderApiKey();

  // Track which provider is currently being removed/saved
  const [activeProviderAction, setActiveProviderAction] = useState<{
    id: string;
    action: "saving" | "removing";
  } | null>(null);

  const handleSaveKey = (
    providerConfigId: string,
    key: string,
    providerName: string,
  ) => {
    const matched = configuredProviders.find(
      (p) =>
        p.id.toLowerCase() === providerConfigId.toLowerCase() ||
        p.name.toLowerCase() === providerConfigId.toLowerCase(),
    );
    const targetId = matched?.id || providerConfigId;

    setActiveProviderAction({ id: providerConfigId, action: "saving" });

    addApiKey(
      { providerId: targetId, apiKey: key },
      {
        onSuccess: () => {
          toast.success(`API key for ${providerName} saved`);
        },
        onError: (err) => {
          toast.error(getErrorMessage(err));
        },
        onSettled: () => {
          setActiveProviderAction(null);
        },
      },
    );
  };

  const handleRemoveKey = (providerConfigId: string, providerName: string) => {
    const matched = configuredProviders.find(
      (p) =>
        p.id.toLowerCase() === providerConfigId.toLowerCase() ||
        p.name.toLowerCase() === providerConfigId.toLowerCase(),
    );
    const targetId = matched?.id || providerConfigId;

    setActiveProviderAction({ id: providerConfigId, action: "removing" });

    removeApiKey(targetId, {
      onSuccess: () => {
        toast.success(`API key for ${providerName} removed`);
      },
      onError: (err) => {
        toast.error(getErrorMessage(err));
      },
      onSettled: () => {
        setActiveProviderAction(null);
      },
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {isLoading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-xs text-muted-foreground">
          <Loader2 className="size-4 animate-spin text-primary" />
          <span>Loading providers...</span>
        </div>
      ) : (
        PROVIDERS_CONFIG.map((provider) => {
          const matched = configuredProviders.find(
            (p) =>
              p.id.toLowerCase() === provider.id.toLowerCase() ||
              p.name.toLowerCase() === provider.id.toLowerCase(),
          );
          const savedKey = matched?.apiKey || "";

          const isCurrentSaving =
            isSaving &&
            activeProviderAction?.id === provider.id &&
            activeProviderAction.action === "saving";
          const isCurrentRemoving =
            activeProviderAction?.id === provider.id &&
            activeProviderAction.action === "removing";

          return (
            <ProviderCard
              key={provider.id}
              provider={provider}
              savedKey={savedKey}
              onSave={(id, key) => handleSaveKey(id, key, provider.name)}
              onClear={(id) => handleRemoveKey(id, provider.name)}
              isSaving={isCurrentSaving}
              isRemoving={isCurrentRemoving}
            />
          );
        })
      )}
    </div>
  );
}
