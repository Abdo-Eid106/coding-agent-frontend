import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useThemeStore, Theme } from "../../store/useThemeStore";

const THEMES: { id: Theme; label: string; description: string; icon: typeof Sun }[] = [
  {
    id: Theme.Dark,
    label: "Dark",
    description: "Deep tones matching code editors, easy on the eyes in low light",
    icon: Moon,
  },
  {
    id: Theme.Light,
    label: "Light",
    description: "Bright, high-contrast display for well-lit environments",
    icon: Sun,
  },
  {
    id: Theme.System,
    label: "System",
    description: "Automatically synchronizes with your operating system preferences",
    icon: Monitor,
  },
];

export default function AppearanceTab() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Theme Mode</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Select your preferred interface color scheme
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {THEMES.map((item) => {
          const Icon = item.icon;
          const isSelected = theme === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTheme(item.id)}
              className={`flex flex-col text-left p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border bg-card hover:bg-accent/40"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-3">
                <div className="size-8 rounded-lg border border-border bg-muted/60 flex items-center justify-center text-foreground">
                  <Icon className="size-4" />
                </div>
                {isSelected && <Check className="size-4 text-primary" />}
              </div>

              <span className="text-sm font-semibold text-foreground">{item.label}</span>
              <span className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {item.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
