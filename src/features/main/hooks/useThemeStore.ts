import { create } from "zustand";
import { persist } from "zustand/middleware";

export enum Theme {
  Dark = "dark",
  Light = "light",
  System = "system",
}

const DARK_QUERY = "(prefers-color-scheme: dark)";

function isDarkTheme(theme: Theme): boolean {
  return (
    theme === Theme.Dark ||
    (theme === Theme.System && window.matchMedia(DARK_QUERY).matches)
  );
}

function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  const isDark = isDarkTheme(theme);

  root.classList.toggle("dark", isDark);
  root.style.colorScheme = isDark ? "dark" : "light";
}

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: Theme.System,
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
    }),
    {
      name: "theme",
      partialize: (state) => ({ theme: state.theme }),
      // Apply the saved theme as soon as it is loaded from storage
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme);
      },
    },
  ),
);

// Follow OS changes while the user is in "system" mode
window.matchMedia(DARK_QUERY).addEventListener("change", () => {
  const { theme } = useThemeStore.getState();
  if (theme === Theme.System) applyTheme(theme);
});
