import { useState, useEffect, useRef } from "react";
import { X, Sliders } from "lucide-react";
import type { SettingsTab } from "./settings/types";
import SettingsSidebar from "./settings/SettingsSidebar";
import ProvidersTab from "./settings/ProvidersTab";
import ModelsTab from "./settings/ModelsTab";
import AppearanceTab from "./settings/AppearanceTab";
import { useUIStore } from "../store/useUIStore";
import { useFetchConfiguredProviders } from "../queries/provider.queries";

interface SettingsModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function SettingsModal({
  isOpen: propIsOpen,
  onClose: propOnClose,
}: SettingsModalProps = {}) {
  const storeIsOpen = useUIStore((s) => s.isSettingsOpen);
  const storeClose = useUIStore((s) => s.closeSettings);

  const isOpen = propIsOpen ?? storeIsOpen;
  const onClose = propOnClose ?? storeClose;

  const [activeTab, setActiveTab] = useState<SettingsTab>("providers");
  const modalRef = useRef<HTMLDivElement>(null);

  const { data: configuredProviders = [] } = useFetchConfiguredProviders();

  const configuredCount = configuredProviders.filter((p) =>
    Boolean(p.apiKey?.trim()),
  ).length;

  const configuredModelsCount = configuredProviders.reduce(
    (acc, p) => acc + (p.models?.length || 0),
    0,
  );

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const tabTitles: Record<SettingsTab, { title: string; subtitle: string }> = {
    providers: {
      title: "Providers",
      subtitle: "Configure your API keys for Gemini, OpenAI, and Anthropic providers.",
    },
    models: {
      title: "Models",
      subtitle: "Browse and inspect all available models, context windows, and readiness.",
    },
    general: {
      title: "General",
      subtitle: "Manage preferences and application settings.",
    },
    appearance: {
      title: "Appearance",
      subtitle: "Customize themes and display styles.",
    },
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6"
    >
      <div
        ref={modalRef}
        className="w-[92vw] max-w-5xl h-[84vh] max-h-[720px] min-h-[500px] rounded-2xl border border-border bg-card text-card-foreground shadow-2xl flex overflow-hidden"
      >
        <SettingsSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          configuredCount={configuredCount}
          modelsCount={configuredModelsCount}
        />

        <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-background">
          {/* Header */}
          <div className="flex items-start justify-between px-6 py-5 border-b border-border">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                {tabTitles[activeTab].title}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {tabTitles[activeTab].subtitle}
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

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
            {activeTab === "providers" && <ProvidersTab />}

            {activeTab === "models" && (
              <ModelsTab onNavigateToProviders={() => setActiveTab("providers")} />
            )}

            {activeTab === "appearance" && <AppearanceTab />}

            {activeTab === "general" && (
              <div className="h-64 flex flex-col items-center justify-center text-center p-8 border border-dashed border-border rounded-xl">
                <Sliders className="size-10 text-muted-foreground mb-3 opacity-60" />
                <h4 className="text-sm font-medium text-foreground">
                  General Settings
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
