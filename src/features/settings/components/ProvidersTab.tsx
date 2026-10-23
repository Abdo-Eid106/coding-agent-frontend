import { useState } from "react";
import { Loader2, Plus, Globe, Trash2 } from "lucide-react";
import ProviderCard from "./ProviderCard";
import { PROVIDERS_CONFIG, type ProviderConfig } from "../types";
import {
  useAddProviderApiKey,
  useRemoveProviderApiKey,
  useFetchProviders,
  useDeleteCustomProvider,
} from "@/features/providers/hooks/provider.queries";
import { toast } from "../../main/components/Toaster";
import { getErrorMessage } from "../../../shared/lib/get-error-message";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CustomProviderModal from "../../providers/components/AddCustomProvider";

export default function ProvidersTab() {
  const { data: providers = [], isLoading } = useFetchProviders();
  const { mutate: addApiKey, isPending: isSaving } = useAddProviderApiKey();
  const { mutate: removeApiKey } = useRemoveProviderApiKey();
  const { mutate: deleteCustomProviderMutation, isPending: isDeleting } =
    useDeleteCustomProvider();

  const [isCustomProviderOpen, setIsCustomProviderOpen] = useState(false);
  const [providerToDelete, setProviderToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Track which provider is currently being removed/saved/deleted
  const [activeProviderAction, setActiveProviderAction] = useState<{
    id: string;
    action: "saving" | "removing" | "deleting";
  } | null>(null);

  const customProviders = providers.filter(
    (cp) =>
      !PROVIDERS_CONFIG.some(
        (p) =>
          p.id.toLowerCase() === cp.id.toLowerCase() ||
          p.name.toLowerCase() === cp.name.toLowerCase(),
      ),
  );

  const handleSaveKey = (
    providerConfigId: string,
    key: string,
    providerName: string,
  ) => {
    const matched = providers.find(
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
    const matched = providers.find(
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

  const handleConfirmDelete = () => {
    if (!providerToDelete) return;

    const matched = providers.find(
      (p) =>
        p.id.toLowerCase() === providerToDelete.id.toLowerCase() ||
        p.name.toLowerCase() === providerToDelete.name.toLowerCase(),
    );
    const targetId = matched?.id || providerToDelete.id;
    const providerName = providerToDelete.name;

    setActiveProviderAction({ id: providerToDelete.id, action: "deleting" });

    deleteCustomProviderMutation(targetId, {
      onSuccess: () => {
        toast.success(`Custom provider "${providerName}" deleted`);
        setProviderToDelete(null);
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
      {/* Action banner to add custom provider */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold text-foreground">
            Custom Provider
          </h3>
          <p className="text-xs text-muted-foreground">
            Connect any OpenAI-compatible API endpoint with your custom models.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setIsCustomProviderOpen(true)}
          className="gap-2 shrink-0 cursor-pointer"
          size="sm"
        >
          <Plus className="size-4" />
          <span>Add Custom Provider</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-xs text-muted-foreground">
          <Loader2 className="size-4 animate-spin text-primary" />
          <span>Loading providers...</span>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            {PROVIDERS_CONFIG.map((provider) => {
              const matched = providers.find(
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
            })}
          </div>

          {customProviders.length > 0 && (
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Custom Providers
              </h4>
              {customProviders.map((cp) => {
                const isCurrentSaving =
                  isSaving &&
                  activeProviderAction?.id === cp.id &&
                  activeProviderAction.action === "saving";
                const isCurrentRemoving =
                  activeProviderAction?.id === cp.id &&
                  activeProviderAction.action === "removing";
                const isCurrentDeleting =
                  isDeleting &&
                  activeProviderAction?.id === cp.id &&
                  activeProviderAction.action === "deleting";

                const customConfig: ProviderConfig = {
                  id: cp.id as any,
                  name: cp.name || cp.id,
                  tagline: cp.baseUrl || "Custom Endpoint",
                  models:
                    cp.models?.map((m) => m.name || m.id).join(", ") ||
                    "Custom models",
                  placeholder: "Enter API key...",
                  docsUrl: cp.baseUrl || "#",
                  icon: Globe,
                };

                return (
                  <ProviderCard
                    key={cp.id}
                    provider={customConfig}
                    savedKey={cp.apiKey || ""}
                    onSave={(id, key) =>
                      handleSaveKey(id, key, cp.name || cp.id)
                    }
                    onClear={(id) => handleRemoveKey(id, cp.name || cp.id)}
                    onDelete={() =>
                      setProviderToDelete({
                        id: cp.id,
                        name: cp.name || cp.id,
                      })
                    }
                    isSaving={isCurrentSaving}
                    isRemoving={isCurrentRemoving}
                    isDeleting={isCurrentDeleting}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      <CustomProviderModal
        open={isCustomProviderOpen}
        onOpenChange={setIsCustomProviderOpen}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(providerToDelete)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setProviderToDelete(null);
          }
        }}
      >
        <DialogContent
          onClick={(e) => e.stopPropagation()}
          className="z-70 sm:max-w-md"
        >
          <DialogHeader>
            <DialogTitle>Delete Custom Provider</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                "{providerToDelete?.name}"
              </span>
              ? This action cannot be undone and will permanently remove this
              provider and its associated models.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-2 flex gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => setProviderToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
              className="gap-2 cursor-pointer"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="size-4" />
                  <span>Delete Provider</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
