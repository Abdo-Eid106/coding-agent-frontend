import { useUpdateProvider } from "../hooks/provider.queries";
import type { AddProviderDto, ProviderDto, UpdateProviderDto } from "../types";
import { toast } from "@/features/main/components/Toaster";
import { getErrorMessage } from "@/shared/lib/get-error-message";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProviderForm } from "./ProviderForm";

export interface UpdateProviderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider?: ProviderDto | null;
}

export default function UpdateProvider({
  open,
  onOpenChange,
  provider,
}: UpdateProviderProps) {
  const providerId = provider?.id ?? "";
  const { mutate: updateProvider, isPending } = useUpdateProvider(providerId);

  const handleSubmit = ({
    displayName,
    baseUrl,
    apiKey,
    models,
  }: AddProviderDto) => {
    if (!providerId) return;

    const payload: UpdateProviderDto = { displayName, baseUrl, apiKey, models };

    updateProvider(payload, {
      onSuccess: () => {
        toast.success(`Provider "${displayName}" updated`);
        onOpenChange(false);
      },
      onError: (err) => toast.error(getErrorMessage(err)),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        className="z-70 flex h-[min(90vh,760px)] max-w-3xl flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl"
      >
        <ScrollArea className="min-h-0 flex-1">
          {open && (
            <ProviderForm
              key={providerId}
              isLoading={isPending}
              onSubmit={handleSubmit}
              isEdit={true}
              initialData={provider}
            />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
