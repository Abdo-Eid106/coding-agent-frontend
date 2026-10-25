import { AlertCircle } from "lucide-react";
import CopyButton from "./CopyButton";

export interface ToolErrorDisplayProps {
  error?: { message?: string } | string | unknown;
  className?: string;
}

export function ToolErrorDisplay({ error, className }: ToolErrorDisplayProps) {
  if (!error) return null;

  const errorMessage =
    typeof error === "string"
      ? error
      : typeof error === "object" &&
          error !== null &&
          "message" in error &&
          typeof (error as { message?: unknown }).message === "string"
        ? (error as { message: string }).message
        : JSON.stringify(error, null, 2);

  return (
    <div
      className={`my-1.5 flex min-w-0 items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive ${className ?? ""}`}
    >
      <AlertCircle className="size-4 shrink-0 text-destructive mt-0.5" />
      <div className="min-w-0 flex-1 overflow-hidden">
        <div className="mb-1 text-xs font-semibold text-destructive">
          Error
        </div>
        <pre className="max-h-60 overflow-y-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-destructive/90 wrap-anywhere">
          {errorMessage}
        </pre>
      </div>
      <CopyButton
        text={errorMessage}
        label="error message"
        className="shrink-0 text-destructive/70 hover:bg-destructive/20 hover:text-destructive"
      />
    </div>
  );
}

export default ToolErrorDisplay;
