import { useState } from "react";
import { Check, Copy, Code2 } from "lucide-react";
import ShikiHighlighter from "react-shiki";

interface CodeBlockProps {
  code: string;
  language?: string;
  boxless?: boolean;
}

export default function CodeBlock({
  code,
  language = "",
  boxless = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cleanLang = (language || "")
    .replace(/^language-/, "")
    .toLowerCase()
    .trim();
  const validLang = cleanLang || "text";
  const displayLang = cleanLang ? cleanLang.toUpperCase() : "CODE";

  if (boxless) {
    return (
      <div className="my-1 overflow-x-auto text-xs font-mono select-text boxless">
        <ShikiHighlighter
          language={validLang}
          theme={{ light: "github-light", dark: "github-dark" }}
          showLanguage={false}
          addDefaultStyles={false}
          className="font-mono text-xs leading-relaxed bg-transparent"
        >
          {code}
        </ShikiHighlighter>
      </div>
    );
  }

  return (
    <div className="my-3 rounded-xl border border-border overflow-hidden bg-card text-card-foreground text-xs font-mono shadow-xs">
      {/* Code Header Bar with Language badge and Copy button */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-muted/40 text-muted-foreground select-none">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground">
          <Code2 className="size-3.5 text-primary" />
          <span>{displayLang}</span>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="size-3 text-foreground" />
              <span className="text-foreground font-sans">Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3" />
              <span className="font-sans">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content highlighted with react-shiki */}
      <div className="p-3.5 overflow-x-auto bg-background/50">
        <ShikiHighlighter
          language={validLang}
          theme={{ light: "github-light", dark: "github-dark" }}
          showLanguage={false}
          addDefaultStyles={false}
          className="font-mono text-xs leading-relaxed"
        >
          {code}
        </ShikiHighlighter>
      </div>
    </div>
  );
}
