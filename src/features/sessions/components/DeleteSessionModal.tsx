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

export interface SessionToDelete {
  id: string;
  title: string;
}

interface DeleteSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: SessionToDelete;
}

export default function DeleteSessionModal({
  open,
  onOpenChange,
  session,
}: DeleteSessionModalProps) {
  const { sessionId } = useParams<{ sessionId?: string }>();
  const { mutate: deleteSession, isPending } = useDeleteSession();
  const navigate = useNavigate();

  const handleConfirmDelete = () => {
    if (isPending) return;

    deleteSession(session.id, {
      onSuccess: () => {
        if (sessionId === session.id) {
          navigate("/");
        }
        toast.success(`Session "${session.title}" deleted`);
        onOpenChange(false);
      },
      onError: (err) => {
        toast.error(getErrorMessage(err));
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onClick={() => onOpenChange(false)}
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
