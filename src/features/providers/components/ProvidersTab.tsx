import { Loader2, Plus, Globe } from "lucide-react";
import ProviderCard from "@/features/providers/components/ProviderCard";
import { useFetchProviders } from "@/features/providers/hooks/provider.queries";
import { Button } from "@/components/ui/button";
import AddProvider from "./AddProviderModal";
import UpdateProvider from "./UpdateProviderModal";
import type { ProviderDto } from "@/features/providers/types";
import { DeleteProviderModal } from "./DeleteProviderModal";
import { useSelectionModal } from "@/shared/hooks/useSelectionModal";
import { useModal } from "@/shared/hooks/useModal";

export default function ProvidersTab() {
  const { data: providers = [], isLoading } = useFetchProviders();

  const addModal = useModal();
  const editModal = useSelectionModal<ProviderDto>();
  const deleteModal = useSelectionModal<ProviderDto>();

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Action banner to add provider */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold text-foreground">Providers</h3>
          <p className="text-xs text-muted-foreground">
            Connect any OpenAI-compatible API endpoint with your models.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => addModal.open()}
          className="gap-2 shrink-0 cursor-pointer"
          size="sm"
        >
          <Plus className="size-4" />
          <span>Add Provider</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-xs text-muted-foreground">
          <Loader2 className="size-4 animate-spin text-primary" />
          <span>Loading providers...</span>
        </div>
      ) : providers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center space-y-2">
          <Globe className="size-8 text-muted-foreground mx-auto" />
          <h4 className="text-sm font-semibold text-foreground">
            No providers configured
          </h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Add an OpenAI-compatible provider to configure models and API
            endpoints.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addModal.open()}
            className="mt-2"
          >
            <Plus className="size-4" />
            <span>Add Provider</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {providers.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              editModal={editModal}
              deleteModal={deleteModal}
            />
          ))}
        </div>
      )}

      <AddProvider modal={addModal} />
      <UpdateProvider modal={editModal} />
      <DeleteProviderModal modal={deleteModal} />
    </div>
  );
}
