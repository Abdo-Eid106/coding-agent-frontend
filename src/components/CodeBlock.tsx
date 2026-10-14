import { useState } from "react";
import { Check, Copy, Code2 } from "lucide-react";
import hljs from "highlight.js";

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

  const cleanLang = language.replace(/^language-/, "").toLowerCase();

  // Highlight code using highlight.js
  let highlightedHtml = "";
  try {
    if (cleanLang && hljs.getLanguage(cleanLang)) {
      highlightedHtml = hljs.highlight(code, { language: cleanLang }).value;
    } else {
      highlightedHtml = hljs.highlightAuto(code).value;
    }
  } catch {
    highlightedHtml = code;
  }

  const displayLang = cleanLang ? cleanLang.toUpperCase() : "CODE";

  if (boxless) {
    return (
      <div className="my-1.5 overflow-x-auto text-xs font-mono select-text boxless">
        <pre className="font-mono leading-relaxed bg-transparent p-0 m-0">
          <code
            className="hljs bg-transparent p-0 leading-relaxed font-mono"
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        </pre>
      </div>
    );
  }

  return (
    <div className="my-3 rounded-xl border border-border/70 overflow-hidden bg-[#1a1b26] text-xs font-mono shadow-xs">
      {/* Code Header Bar with Language badge and Copy button */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/40 bg-[#16161e] text-muted-foreground select-none">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground">
          <Code2 className="size-3.5 text-primary" />
          <span>{displayLang}</span>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] hover:bg-white/10 hover:text-foreground transition-colors cursor-pointer"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="size-3 text-emerald-400" />
              <span className="text-emerald-400 font-sans">Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3" />
              <span className="font-sans">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content highlighted with Tokyo Night theme */}
      <div className="p-3.5 overflow-x-auto">
        <pre className="font-mono leading-relaxed bg-transparent p-0 m-0">
          <code
            className="hljs bg-transparent p-0 leading-relaxed font-mono"
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        </pre>
      </div>
    </div>
  );
}
