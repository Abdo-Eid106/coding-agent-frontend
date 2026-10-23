export interface AddApiKeyDto {
  apiKey: string;
}

export interface ConfiguredProviderDto {
  id: string;
  displayName: string;
  apiKey: string | null;
  baseUrl: string | null;
  models: ModelDto[];
}

export interface ModelDto {
  id: string;
  displayName: string;
  apiModel: string;
  contextWindow: number;
  defaultMaxTokens: number;
  supportsAttachments: boolean;
  provider: string;
}

import type { LucideIcon } from "lucide-react";
import { Sparkles, Bot, BrainCircuit } from "lucide-react";

export type SettingsTab = "providers" | "models" | "general" | "appearance";

export interface ProviderConfig {
  id: string;
  displayName: string;
  tagline: string;
  models: string;
  placeholder: string;
  docsUrl: string;
  icon: LucideIcon;
}

export const PROVIDERS_CONFIG: ProviderConfig[] = [
  {
    id: "gemini",
    displayName: "Google Gemini",
    tagline: "High-speed reasoning & multimodal capabilities",
    models: "Gemini 3.8 Flash, 2.5 Pro, 2.5 Flash",
    placeholder: "AIzaSy...",
    docsUrl: "https://aistudio.google.com/app/apikey",
    icon: Sparkles,
  },
  {
    id: "openai",
    displayName: "OpenAI",
    tagline: "Industry standard models & deep reasoning",
    models: "GPT-4o, GPT-4o mini, o1, o3-mini",
    placeholder: "sk-proj-...",
    docsUrl: "https://platform.openai.com/api-keys",
    icon: Bot,
  },
  {
    id: "anthropic",
    displayName: "Anthropic",
    tagline: "Exceptional coding & nuanced reasoning",
    models: "Claude 3.7 Sonnet, Opus 4.6, 3.5 Haiku",
    placeholder: "sk-ant-api03-...",
    docsUrl: "https://console.anthropic.com/settings/keys",
    icon: BrainCircuit,
  },
];
