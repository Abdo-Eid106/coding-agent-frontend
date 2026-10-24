import { useAddProvider } from "../hooks/provider.queries";
import type { AddProviderDto } from "../types";
import { toast } from "@/features/main/components/Toaster";
import { getErrorMessage } from "@/shared/lib/get-error-message";
import { ProviderForm } from "./ProviderForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles } from "lucide-react";
import type { Modal } from "@/shared/hooks/useModal";

export interface AddProviderProps {
  modal: Modal;
}

export default function AddProvider({ modal }: AddProviderProps) {
  const { mutate: addProvider, isPending } = useAddProvider();

  const handleSubmit = (payload: AddProviderDto) => {
    addProvider(payload, {
      onSuccess: () => {
        toast.success(`Provider "${payload.displayName}" added`);
        modal.close();
      },
      onError: (err) => {
        toast.error(getErrorMessage(err));
      },
    });
  };

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.setIsOpen}>
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        className="z-70 flex h-[min(90vh,760px)] max-w-3xl flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl"
      >
        <ScrollArea className="min-h-0 flex-1 px-8 py-10">
          <DialogHeader className="gap-4 text-left pb-6">
            <div className="flex items-center gap-4">
              <Sparkles className="size-5" />
              <DialogTitle className="text-xl">Add provider</DialogTitle>
            </div>
            <DialogDescription>
              Update provider configuration and models.
            </DialogDescription>
          </DialogHeader>
          {modal.isOpen && (
            <ProviderForm
              key={"new"}
              isLoading={isPending}
              onSubmit={handleSubmit}
            />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
