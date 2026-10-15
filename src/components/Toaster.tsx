import { Toaster as Sonner, toast, type ToasterProps } from "sonner";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  Loader2,
} from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

export function Toaster({ ...props }: ToasterProps) {
  const effectiveTheme = useThemeStore((s) => s.effectiveTheme);

  return (
    <Sonner
      theme={effectiveTheme}
      className="toaster group font-sans"
      style={
        {
          "--normal-bg": "var(--card)",
          "--normal-text": "var(--card-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "var(--card)",
          "--success-text": "var(--card-foreground)",
          "--success-border": "var(--border)",
          "--error-bg": "var(--card)",
          "--error-text": "var(--card-foreground)",
          "--error-border": "var(--destructive)",
          "--warning-bg": "var(--card)",
          "--warning-text": "var(--card-foreground)",
          "--warning-border": "var(--border)",
          "--info-bg": "var(--card)",
          "--info-text": "var(--card-foreground)",
          "--info-border": "var(--border)",
        } as React.CSSProperties
      }
      icons={{
        success: <CheckCircle2 className="size-4 text-primary" />,
        info: <Info className="size-4 text-muted-foreground" />,
        warning: <AlertTriangle className="size-4 text-accent-foreground" />,
        error: <AlertCircle className="size-4 text-destructive" />,
        loading: <Loader2 className="size-4 text-primary animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast bg-card text-card-foreground border-border shadow-lg rounded-xl font-sans text-xs border",
          title: "text-foreground font-medium text-xs",
          description: "text-muted-foreground text-xs",
          actionButton:
            "bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-xs rounded-md transition-colors",
          cancelButton:
            "bg-muted text-muted-foreground hover:bg-muted/80 font-medium text-xs rounded-md transition-colors",
          closeButton:
            "bg-card text-muted-foreground border-border hover:text-foreground hover:bg-accent transition-colors",
          error: "border-destructive/30 text-destructive",
          success: "border-primary/30 text-foreground",
          warning: "border-border text-foreground",
          info: "border-border text-foreground",
        },
      }}
      {...props}
    />
  );
}

export { toast };
