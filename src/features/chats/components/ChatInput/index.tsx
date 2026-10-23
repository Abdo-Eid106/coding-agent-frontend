import { useState } from "react";
import { useParams } from "react-router-dom";
import CreateSessionInput from "./CreateSessionInput";
import AddMessageInput from "./AddMessageInput";
import { InterruptPanel, type Interrupt } from "../InterruptPanel";
import { toast } from "@/features/main/components/Toaster";
import { cn } from "@/lib/utils";

const DUMMY_INTERRUPT: Interrupt = {
  question:
    "The assistant is requesting permission to execute the command 'pnpm test' in your workspace.",
  options: [
    {
      id: "approve",
      label: "Approve command",
      description:
        "Allow the assistant to execute the command and inspect the output.",
    },
    {
      id: "reject",
      label: "Reject command",
      description: "Deny execution and continue without running the script.",
    },
    {
      id: "modify",
      label: "Modify command",
      description:
        "Ask the assistant to change the parameters or run a different script.",
    },
  ],
};

export default function ChatInput() {
  const { sessionId } = useParams<{ sessionId?: string }>();
  const [interrupt, setInterrupt] = useState<Interrupt | null>(DUMMY_INTERRUPT);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResolve = (optionId: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setInterrupt(null);
      const chosen = interrupt?.options.find((o) => o.id === optionId);
      toast.success(
        `Action confirmed: ${chosen?.label || optionId}`,
      );
    }, 800);
  };

  const handleDismiss = () => {
    setInterrupt(null);
    toast.info("Interrupt dismissed");
  };

  const inputProps = {
    disabled: !!interrupt,
    placeholder: interrupt
      ? "Choose an option above to continue"
      : undefined,
    className: cn(interrupt && "rounded-t-none border-t-0"),
  };

  return (
    <div className="w-full">
      {!interrupt && (
        <div className="flex justify-end mb-1.5">
          <button
            type="button"
            onClick={() => setInterrupt(DUMMY_INTERRUPT)}
            className="text-[11px] text-muted-foreground/70 hover:text-muted-foreground transition-colors cursor-pointer"
          >
            Show demo interrupt
          </button>
        </div>
      )}

      {interrupt && (
        <InterruptPanel
          key={interrupt.question}
          interrupt={interrupt}
          isSubmitting={isSubmitting}
          onResolve={handleResolve}
          onDismiss={handleDismiss}
        />
      )}

      {sessionId == undefined ? (
        <CreateSessionInput {...inputProps} />
      ) : (
        <AddMessageInput {...inputProps} />
      )}
    </div>
  );
}
