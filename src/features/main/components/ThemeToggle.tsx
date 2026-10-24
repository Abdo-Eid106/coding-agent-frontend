import { Sun, Moon, Monitor, type LucideIcon } from "lucide-react";
import { useThemeStore, Theme } from "../hooks/useThemeStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const THEME_OPTIONS: { id: Theme; label: string; icon: LucideIcon }[] = [
  { id: Theme.Light, label: "Light", icon: Sun },
  { id: Theme.Dark, label: "Dark", icon: Moon },
  { id: Theme.System, label: "System", icon: Monitor },
];

export default function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  const current =
    THEME_OPTIONS.find((opt) => opt.id === theme) ?? THEME_OPTIONS[0];
  const CurrentIcon = current.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            title={`Theme: ${current.label}`}
            aria-label={`Theme: ${current.label}`}
            className="cursor-pointer text-muted-foreground hover:text-foreground"
          />
        }
      >
        <CurrentIcon className="size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-36">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) => setTheme(value as Theme)}
        >
          {THEME_OPTIONS.map(({ id, label, icon: Icon }) => (
            <DropdownMenuRadioItem
              key={id}
              value={id}
              className="cursor-pointer"
            >
              <Icon className="size-3.5" />
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
