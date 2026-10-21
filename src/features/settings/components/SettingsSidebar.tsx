import { KeyRound, Cpu, Sliders, Palette } from "lucide-react";
import type { SettingsTab } from "../types";

interface SettingsSidebarProps {
  activeTab: SettingsTab;
  onSelectTab: (tab: SettingsTab) => void;
  configuredCount: number;
  modelsCount?: number;
}

export default function SettingsSidebar({
  activeTab,
  onSelectTab,
  configuredCount,
  modelsCount,
}: SettingsSidebarProps) {
  return (
    <aside className="w-56 sm:w-64 min-w-56 shrink-0 border-r border-border bg-sidebar flex flex-col justify-between p-3 select-none">
      <div className="space-y-4">
        <div className="px-3 pt-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Settings
          </span>
        </div>

        <nav className="space-y-1">
          {/* Providers */}
          <button
            onClick={() => onSelectTab("providers")}
            className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "providers"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            <KeyRound className="size-4 shrink-0" />
            <span>Providers</span>
            {configuredCount > 0 && (
              <span className="ml-auto text-[11px] font-mono px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground border border-border">
                {configuredCount}
              </span>
            )}
          </button>

          {/* Models */}
          <button
            onClick={() => onSelectTab("models")}
            className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "models"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            <Cpu className="size-4 shrink-0" />
            <span>Models</span>
            <span className="ml-auto text-[11px] font-mono px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground border border-border">
              {modelsCount ?? 0}
            </span>
          </button>

          {/* General */}
          <button
            onClick={() => onSelectTab("general")}
            className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "general"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            <Sliders className="size-4 shrink-0" />
            <span>General</span>
          </button>

          {/* Appearance */}
          <button
            onClick={() => onSelectTab("appearance")}
            className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "appearance"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            <Palette className="size-4 shrink-0" />
            <span>Appearance</span>
          </button>
        </nav>
      </div>

      {/* User Profile */}
      <div className="pt-3 border-t border-border">
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-accent transition-colors">
          <div className="size-7 rounded-full bg-muted text-foreground border border-border flex items-center justify-center font-medium text-xs shrink-0">
            A
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium truncate text-foreground">
              Abdo Eid
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              abdoeid2121@gmail.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
