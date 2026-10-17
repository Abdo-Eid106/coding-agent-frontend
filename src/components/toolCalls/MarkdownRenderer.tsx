import Markdown from "react-markdown";
import { isInlineCode } from "react-shiki";
import CodeBlock from "./CodeBlock";

interface MarkdownRendererProps {
  content: string;
  boxless?: boolean;
}

export default function MarkdownRenderer({
  content,
  boxless = false,
}: MarkdownRendererProps) {
  return (
    <div className="text-sm leading-relaxed text-foreground select-text">
      <Markdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-foreground mt-5 mb-2.5 tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-foreground mt-4 mb-2 tracking-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold text-foreground mt-3 mb-1.5">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-3 leading-relaxed text-foreground/90 last:mb-0">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 mb-3 text-foreground/90 pl-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 mb-3 text-foreground/90 pl-1">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-primary/50 pl-3 my-2 text-muted-foreground italic">
              {children}
            </blockquote>
          ),
          code: ({ className, children, node, ...props }) => {
            const isInline = node
              ? isInlineCode(node as never)
              : !className && !String(children).includes("\n");

            if (!isInline) {
              const codeString = String(children).replace(/\n$/, "");
              return (
                <CodeBlock
                  code={codeString}
                  language={className}
                  boxless={boxless}
                />
              );
            }

            return (
              <code
                className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono text-foreground border border-border/50"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ children }) => <>{children}</>,
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
