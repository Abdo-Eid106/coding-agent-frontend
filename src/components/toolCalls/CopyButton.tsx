import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export default function CopyButton({
  text,
  label = "content",
  className = "",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1000);
    } catch {
      // Clipboard access may be unavailable.
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      className={`rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer ${className}`}
      aria-label={`Copy ${label}`}
      title={`Copy ${label}`}
    >
      {copied ? (
        <Check className="size-3.5 text-green-500" />
      ) : (
        <Copy className="size-3.5" />
      )}
    </button>
  );
}
