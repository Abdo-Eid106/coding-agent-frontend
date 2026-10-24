import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ProviderDto } from "../types";
import { useDeleteProvider } from "../hooks/provider.queries";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "@/features/main/components/Toaster";
import { getErrorMessage } from "@/shared/lib/get-error-message";
import type { SelectionModal } from "@/shared/hooks/useSelectionModal";

interface Props {
  modal: SelectionModal<ProviderDto>;
}

export function DeleteProviderModal({ modal }: Props) {
  const { mutate, isPending } = useDeleteProvider();
  const provider = modal.selected;

  const handleDelete = () => {
    if (!provider) return;
    const name = provider.displayName;

    mutate(provider.id, {
      onSuccess: () => {
        toast.success(`Provider "${name}" deleted`);
        modal.close();
      },
      onError: (err) => {
        toast.error(getErrorMessage(err));
      },
    });
  };

  return (
    <Dialog
      open={Boolean(provider)}
      onOpenChange={(open) => {
        if (!open && !isPending) {
          modal.close();
        }
      }}
    >
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        className="z-70 sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle>Delete Provider</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              "{provider?.displayName}"
            </span>
            ? This action cannot be undone and will permanently remove this
            provider and its associated models.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-2 flex gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => modal.close()}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={handleDelete}
            className="gap-2 cursor-pointer"
          >
            {isPending ? (
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
  );
}
