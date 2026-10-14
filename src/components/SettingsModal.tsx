import { useState, useEffect, useRef, useMemo } from "react";
import {
  X,
  KeyRound,
  Eye,
  EyeOff,
  Check,
  ExternalLink,
  Sparkles,
  Bot,
  BrainCircuit,
  Lock,
  Trash2,
  Sliders,
  Palette,
  Cpu,
  Search,
  ArrowRight,
} from "lucide-react";
import { AVAILABLE_MODELS } from "../store/models";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProviderConfig {
  id: "gemini" | "openai" | "anthropic";
  name: string;
  tagline: string;
  models: string;
  placeholder: string;
  docsUrl: string;
  icon: typeof Sparkles;
}

const PROVIDERS: ProviderConfig[] = [
  {
    id: "gemini",
    name: "Google Gemini",
    tagline: "High-speed reasoning & multimodal capabilities",
    models: "Gemini 3.8 Flash, 2.5 Pro, 2.5 Flash",
    placeholder: "AIzaSy...",
    docsUrl: "https://aistudio.google.com/app/apikey",
    icon: Sparkles,
  },
  {
    id: "openai",
    name: "OpenAI",
    tagline: "Industry standard models & deep reasoning",
    models: "GPT-4o, GPT-4o mini, o1, o3-mini",
    placeholder: "sk-proj-...",
    docsUrl: "https://platform.openai.com/api-keys",
    icon: Bot,
  },
  {
    id: "anthropic",
    name: "Anthropic",
    tagline: "Exceptional coding & nuanced reasoning",
    models: "Claude 3.7 Sonnet, Opus 4.6, 3.5 Haiku",
    placeholder: "sk-ant-api03-...",
    docsUrl: "https://console.anthropic.com/settings/keys",
    icon: BrainCircuit,
  },
];

const STORAGE_KEY = "coding_agent_provider_keys";

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<string>("providers");
  const [savedKeys, setSavedKeys] = useState<Record<string, string>>({
    gemini: "",
    openai: "",
    anthropic: "",
  });
  const [inputValues, setInputValues] = useState<Record<string, string>>({
    gemini: "",
    openai: "",
    anthropic: "",
  });
  const [showKey, setShowKey] = useState<Record<string, boolean>>({
    gemini: false,
    openai: false,
    anthropic: false,
  });
  const [justSaved, setJustSaved] = useState<Record<string, boolean>>({});
  const [modelSearch, setModelSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState<string>("All");

  const modalRef = useRef<HTMLDivElement>(null);

  // Load saved keys from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSavedKeys((prev) => ({ ...prev, ...parsed }));
        setInputValues((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignore parse error
    }
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Close when clicking outside modal content
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleInputChange = (providerId: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [providerId]: value }));
  };

  const handleSaveKey = (providerId: string) => {
    const trimmed = (inputValues[providerId] || "").trim();
    const updated = { ...savedKeys, [providerId]: trimmed };
    setSavedKeys(updated);
    setInputValues((prev) => ({ ...prev, [providerId]: trimmed }));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setJustSaved((prev) => ({ ...prev, [providerId]: true }));
      setTimeout(() => {
        setJustSaved((prev) => ({ ...prev, [providerId]: false }));
      }, 2000);
    } catch {
      // storage unavailable
    }
  };

  const handleClearKey = (providerId: string) => {
    const updated = { ...savedKeys, [providerId]: "" };
    setSavedKeys(updated);
    setInputValues((prev) => ({ ...prev, [providerId]: "" }));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // storage unavailable
    }
  };

  const toggleShowKey = (providerId: string) => {
    setShowKey((prev) => ({ ...prev, [providerId]: !prev[providerId] }));
  };

  // Filtered models for Models tab
  const filteredModels = useMemo(() => {
    return AVAILABLE_MODELS.filter((model) => {
      const matchesFilter =
        providerFilter === "All" || model.provider === providerFilter;
      const matchesSearch =
        modelSearch.trim() === "" ||
        model.name.toLowerCase().includes(modelSearch.toLowerCase()) ||
        (model.tag && model.tag.toLowerCase().includes(modelSearch.toLowerCase())) ||
        (model.description &&
          model.description.toLowerCase().includes(modelSearch.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [providerFilter, modelSearch]);

  if (!isOpen) return null;

  const configuredCount = Object.values(savedKeys).filter(Boolean).length;

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6"
    >
      <div
        ref={modalRef}
        className="w-[92vw] max-w-5xl h-[84vh] max-h-[720px] min-h-[500px] rounded-2xl border border-border bg-card text-card-foreground shadow-2xl flex overflow-hidden"
      >
        {/* Modal Left Sidebar */}
        <aside className="w-56 sm:w-64 min-w-56 shrink-0 border-r border-border bg-sidebar flex flex-col justify-between p-3 select-none">
          <div className="space-y-4">
            <div className="px-3 pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Settings
              </span>
            </div>

            <nav className="space-y-1">
              {/* Providers Tab */}
              <button
                onClick={() => setActiveTab("providers")}
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

              {/* Models Tab */}
              <button
                onClick={() => setActiveTab("models")}
                className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === "models"
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <Cpu className="size-4 shrink-0" />
                <span>Models</span>
                <span className="ml-auto text-[11px] font-mono px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground border border-border">
                  {AVAILABLE_MODELS.length}
                </span>
              </button>

              {/* General Tab */}
              <button
                onClick={() => setActiveTab("general")}
                className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === "general"
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <Sliders className="size-4 shrink-0" />
                <span>General</span>
              </button>

              {/* Appearance Tab */}
              <button
                onClick={() => setActiveTab("appearance")}
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

          {/* User Profile Footer in Sidebar */}
          <div className="pt-3 border-t border-border">
            <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-accent transition-colors">
              <div className="size-7 rounded-full bg-muted text-foreground border border-border flex items-center justify-center font-medium text-xs shrink-0">
                A
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium truncate text-foreground">Abdo Eid</p>
                <p className="text-[11px] text-muted-foreground truncate">abdoeid2121@gmail.com</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Modal Right Main Content Area */}
        <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-background">
          {/* Header */}
          <div className="flex items-start justify-between px-6 py-5 border-b border-border">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                {activeTab === "providers"
                  ? "Providers"
                  : activeTab === "models"
                  ? "Models"
                  : activeTab === "general"
                  ? "General"
                  : "Appearance"}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {activeTab === "providers"
                  ? "Configure your API keys for Gemini, OpenAI, and Anthropic providers."
                  : activeTab === "models"
                  ? "Browse and inspect all available models, context windows, and readiness."
                  : "Manage preferences and application settings."}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
            {activeTab === "providers" ? (
              <div className="space-y-6 max-w-3xl">
                {PROVIDERS.map((provider) => {
                  const Icon = provider.icon;
                  const isConfigured = Boolean(savedKeys[provider.id]?.trim());
                  const isVisible = Boolean(showKey[provider.id]);
                  const currentValue = inputValues[provider.id] || "";
                  const savedValue = savedKeys[provider.id] || "";
                  const isDirty = currentValue !== savedValue;
                  const isSaved = Boolean(justSaved[provider.id]);

                  return (
                    <div
                      key={provider.id}
                      className="rounded-xl border border-border bg-card p-5 space-y-4"
                    >
                      {/* Provider Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-lg flex items-center justify-center border border-border bg-muted/50 text-foreground">
                            <Icon className="size-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-semibold text-foreground">
                                {provider.name}
                              </h3>
                              {isConfigured ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted text-foreground border border-border">
                                  <Check className="size-3 text-muted-foreground" />
                                  Configured
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted/40 text-muted-foreground border border-border/50">
                                  Not set
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {provider.tagline} •{" "}
                              <span>{provider.models}</span>
                            </p>
                          </div>
                        </div>

                        <a
                          href={provider.docsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground shrink-0 mt-1 cursor-pointer transition-colors"
                        >
                          <span>Get key</span>
                          <ExternalLink className="size-3" />
                        </a>
                      </div>

                      {/* API Key Input and Individual Save Button */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor={`key-${provider.id}`}
                            className="text-xs font-medium text-foreground flex items-center gap-1.5"
                          >
                            <Lock className="size-3 text-muted-foreground" />
                            API Key
                          </label>
                          {isConfigured && (
                            <button
                              type="button"
                              onClick={() => handleClearKey(provider.id)}
                              className="text-[11px] text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors cursor-pointer"
                              title="Clear API key"
                            >
                              <Trash2 className="size-3" />
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="relative flex-1 flex items-center">
                            <input
                              id={`key-${provider.id}`}
                              type={isVisible ? "text" : "password"}
                              value={currentValue}
                              onChange={(e) => handleInputChange(provider.id, e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveKey(provider.id);
                              }}
                              placeholder={provider.placeholder}
                              autoComplete="new-password"
                              spellCheck={false}
                              className="w-full pl-3 pr-10 py-2 rounded-lg bg-background border border-input text-foreground text-sm font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring focus:border-input transition-colors"
                            />

                            <button
                              type="button"
                              onClick={() => toggleShowKey(provider.id)}
                              className="absolute right-2.5 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
                              title={isVisible ? "Hide API key" : "Show API key"}
                            >
                              {isVisible ? (
                                <EyeOff className="size-4" />
                              ) : (
                                <Eye className="size-4" />
                              )}
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSaveKey(provider.id)}
                            disabled={!isDirty}
                            className="px-3.5 py-2 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
                          >
                            {isSaved ? (
                              <>
                                <Check className="size-3.5" />
                                <span>Saved</span>
                              </>
                            ) : (
                              <span>Save</span>
                            )}
                          </button>
                        </div>

                        <p className="text-[11px] text-muted-foreground">
                          Keys are stored securely in your browser's local storage and used directly for requests.
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : activeTab === "models" ? (
              <div className="space-y-5 max-w-4xl">
                {/* Search & Provider Filter Controls */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2">
                  {/* Search Input */}
                  <div className="relative flex-1 max-w-sm">
                    <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input
                      type="text"
                      value={modelSearch}
                      onChange={(e) => setModelSearch(e.target.value)}
                      placeholder="Search models..."
                      className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-card border border-input text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
                    />
                    {modelSearch && (
                      <button
                        onClick={() => setModelSearch("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                    {["All", "Google", "Anthropic", "OpenAI", "Open Source"].map((prov) => (
                      <button
                        key={prov}
                        onClick={() => setProviderFilter(prov)}
                        className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                          providerFilter === prov
                            ? "bg-accent text-accent-foreground border border-border"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        }`}
                      >
                        {prov}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Models List */}
                <div className="space-y-2.5">
                  {filteredModels.map((model) => {
                    const isKeyConfigured = model.providerId
                      ? Boolean(savedKeys[model.providerId]?.trim())
                      : true;

                    const Icon =
                      model.provider === "Google"
                        ? Sparkles
                        : model.provider === "Anthropic"
                        ? BrainCircuit
                        : model.provider === "OpenAI"
                        ? Bot
                        : Cpu;

                    return (
                      <div
                        key={model.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-card hover:bg-accent/20 transition-colors"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="size-9 rounded-lg border border-border bg-muted/50 flex items-center justify-center text-foreground shrink-0 mt-0.5">
                            <Icon className="size-4" />
                          </div>

                          <div className="min-w-0 space-y-0.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-semibold text-foreground truncate">
                                {model.name}
                              </h4>

                              {model.tag && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground border border-border">
                                  {model.tag}
                                </span>
                              )}

                              {model.contextWindow && (
                                <span className="text-[11px] text-muted-foreground">
                                  • {model.contextWindow}
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {model.description}
                            </p>
                          </div>
                        </div>

                        {/* Status / Action */}
                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          {!model.available ? (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted/40 text-muted-foreground border border-border/50">
                              Unavailable
                            </span>
                          ) : isKeyConfigured ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-muted text-foreground border border-border">
                              <Check className="size-3 text-muted-foreground" />
                              Ready
                            </span>
                          ) : (
                            <button
                              onClick={() => setActiveTab("providers")}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-muted text-foreground hover:bg-accent border border-border transition-colors cursor-pointer"
                              title="Go to Providers to set API key"
                            >
                              <span>Key required</span>
                              <ArrowRight className="size-3 text-muted-foreground" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {filteredModels.length === 0 && (
                    <div className="p-8 text-center border border-dashed border-border rounded-xl">
                      <p className="text-xs text-muted-foreground">
                        No models found matching your search.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-8 border border-dashed border-border rounded-xl">
                <Sliders className="size-10 text-muted-foreground mb-3 opacity-60" />
                <h4 className="text-sm font-medium text-foreground">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings
                </h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                  This section will be configurable in a future update.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
