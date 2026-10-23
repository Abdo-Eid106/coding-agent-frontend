import { KeyRound, Cpu, Sliders, Palette } from "lucide-react";
import { SettingsTab } from "../types";
import { Badge } from "@/components/ui/badge";

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
  const navItems = [
    {
      id: SettingsTab.PROVIDERS,
      label: "Providers",
      icon: KeyRound,
      badge: configuredCount > 0 ? configuredCount : undefined,
    },
    {
      id: SettingsTab.MODELS,
      label: "Models",
      icon: Cpu,
      badge: modelsCount ?? 0,
    },
    {
      id: SettingsTab.GENERAL,
      label: "General",
      icon: Sliders,
    },
    {
      id: SettingsTab.APPEARANCE,
      label: "Appearance",
      icon: Palette,
    },
  ];

  return (
    <aside className="w-56 sm:w-64 min-w-56 shrink-0 border-r border-border bg-sidebar flex flex-col justify-between p-3 select-none">
      <div className="space-y-4">
        <div className="px-3 pt-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Settings
          </span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <Badge
                    variant="outline"
                    className="ml-auto text-[11px] font-mono px-1.5 py-0 h-4.5"
                  >
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
