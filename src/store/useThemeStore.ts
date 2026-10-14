import { create } from "zustand";

export enum Theme {
  Dark = "dark",
  Light = "light",
  System = "system",
}

export type EffectiveTheme = Theme.Dark | Theme.Light;

interface ThemeState {
  theme: Theme;
  effectiveTheme: EffectiveTheme;
  setTheme: (theme: Theme) => void;
}

const STORAGE_KEY = "coding_agent_theme";
const DEFAULT_THEME: Theme = Theme.Dark;
const DARK_QUERY = "(prefers-color-scheme: dark)";
const isBrowser = typeof window !== "undefined";

const isTheme = (value: unknown): value is Theme =>
  Object.values(Theme).includes(value as Theme);

function getSystemTheme(): EffectiveTheme {
  if (!isBrowser) return Theme.Dark;
  return window.matchMedia(DARK_QUERY).matches ? Theme.Dark : Theme.Light;
}

function resolveTheme(theme: Theme): EffectiveTheme {
  return theme === Theme.System ? getSystemTheme() : theme;
}

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isTheme(stored)) return stored;
  } catch {
    // storage unavailable (private mode, SSR)
  }
  return DEFAULT_THEME;
}

function writeStoredTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // ignore
  }
}

function applyToDOM(effectiveTheme: EffectiveTheme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", effectiveTheme === Theme.Dark);
}

const initialTheme = readStoredTheme();
const initialEffectiveTheme = resolveTheme(initialTheme);
applyToDOM(initialEffectiveTheme);

export const useThemeStore = create<ThemeState>((set) => ({
  theme: initialTheme,
  effectiveTheme: initialEffectiveTheme,

  setTheme: (theme) => {
    const effectiveTheme = resolveTheme(theme);
    applyToDOM(effectiveTheme);
    writeStoredTheme(theme);
    set({ theme, effectiveTheme });
  },
}));

// Follow OS theme changes while the user is on "system"
if (isBrowser) {
  window.matchMedia(DARK_QUERY).addEventListener("change", () => {
    if (useThemeStore.getState().theme !== Theme.System) return;
    const effectiveTheme = getSystemTheme();
    applyToDOM(effectiveTheme);
    useThemeStore.setState({ effectiveTheme });
  });
}
