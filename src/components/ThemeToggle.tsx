import { useState, useRef, useEffect } from "react";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useThemeStore, Theme } from "../store/useThemeStore";
import Dropdown from "./Dropdown";

const THEME_OPTIONS: { id: Theme; label: string; icon: typeof Sun }[] = [
  { id: Theme.Light, label: "Light", icon: Sun },
  { id: Theme.Dark, label: "Dark", icon: Moon },
  { id: Theme.System, label: "System", icon: Monitor },
];

export default function ThemeToggle() {
  const { theme, effectiveTheme, setTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const CurrentIcon =
    theme === Theme.System
      ? Monitor
      : effectiveTheme === Theme.Dark
      ? Moon
      : Sun;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-1"
        title={`Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}
      >
        <CurrentIcon className="size-4" />
      </button>

      <Dropdown
        isOpen={isOpen}
        direction="down"
        className="absolute right-0 top-full mt-1.5 z-50"
      >
        <div className="min-w-[140px] rounded-lg border border-border bg-popover text-popover-foreground shadow-lg py-1 select-none">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50">
            Appearance
          </div>

          <div className="py-1">
            {THEME_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = theme === opt.id;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setTheme(opt.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-accent text-accent-foreground"
                      : "text-popover-foreground hover:bg-accent/60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="size-3.5 text-muted-foreground" />
                    <span>{opt.label}</span>
                  </div>

                  {isSelected && <Check className="size-3.5 text-primary" />}
                </button>
              );
            })}
          </div>
        </div>
      </Dropdown>
    </div>
  );
}
