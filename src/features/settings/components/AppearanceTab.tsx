import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useThemeStore, Theme } from "../../main/hooks/useThemeStore";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

const THEMES = [
  {
    id: Theme.Dark,
    label: "Dark",
    description:
      "Deep tones matching code editors, easy on the eyes in low light",
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
    description:
      "Automatically synchronizes with your operating system preferences",
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
            <Card
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => setTheme(item.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setTheme(item.id);
                }
              }}
              className={`p-4 gap-3 cursor-pointer transition-all ${
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                  : "hover:bg-accent/40"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="size-8 rounded-lg border border-border bg-muted/60 flex items-center justify-center text-foreground">
                  <Icon className="size-4" />
                </div>
                {isSelected && <Check className="size-4 text-primary" />}
              </div>

              <div className="space-y-1">
                <CardTitle className="text-sm font-semibold text-foreground">
                  {item.label}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground line-clamp-2">
                  {item.description}
                </CardDescription>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
