import { useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useDeleteSession } from "../hooks/session.queries";
import { getErrorMessage } from "../../../shared/lib/get-error-message";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type SelectionModal } from "@/shared/hooks/useSelectionModal";

interface Props {
  modal: SelectionModal<{ id: string; title: string }>;
}

export default function DeleteSessionModal({ modal }: Props) {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId?: string }>();

  const { mutate: deleteSession, isPending } = useDeleteSession();

  const session = modal.selected;
  if (!session) return null;

  const onSuccess = () => {
    if (sessionId === session.id) navigate("/");
    toast.success(`Session "${session.title || "Untitled Session"}" deleted`);
    modal.close();
  };

  const onError = (err: Error) => {
    toast.error(getErrorMessage(err));
  };

  const handleConfirmDelete = () => {
    if (isPending) return;
    deleteSession(session.id, { onSuccess, onError });
  };

  return (
    <Dialog
      open={!!session}
      onOpenChange={(open) => {
        if (!open && !isPending) {
          modal.close();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
              <AlertTriangle className="size-4" />
            </div>
            <div>
              <DialogTitle>Delete Session</DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                This action cannot be undone
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="text-xs text-muted-foreground leading-relaxed">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-foreground break-all">
            &ldquo;{session.title}&rdquo;
          </span>
          ? All messages and conversation history in this session will be
          permanently removed.
        </div>

        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => modal.close()}
            disabled={isPending}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleConfirmDelete}
            disabled={isPending}
            className="cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete Session</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
