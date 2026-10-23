import { useState } from "react";
import { X, Sliders } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SettingsTab } from "../types";
import SettingsSidebar from "./SettingsSidebar";
import ProvidersTab from "../../providers/components/ProvidersTab";
import ModelsTab from "../../providers/components/ModelsTab";
import AppearanceTab from "./AppearanceTab";
import { useUIStore } from "../../main/hooks/useUIStore";

interface SettingsModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const TAB_TITLES: Record<SettingsTab, { title: string; subtitle: string }> = {
  [SettingsTab.PROVIDERS]: {
    title: "Providers",
    subtitle: "Configure your API endpoints and models for providers.",
  },
  [SettingsTab.MODELS]: {
    title: "Models",
    subtitle:
      "Browse and inspect all available models, context windows, and readiness.",
  },
  [SettingsTab.GENERAL]: {
    title: "General",
    subtitle: "Manage preferences and application settings.",
  },
  [SettingsTab.APPEARANCE]: {
    title: "Appearance",
    subtitle: "Customize themes and display styles.",
  },
};

export default function SettingsModal({
  isOpen: propIsOpen,
  onClose: propOnClose,
}: SettingsModalProps = {}) {
  const storeIsOpen = useUIStore((s) => s.isSettingsOpen);
  const storeClose = useUIStore((s) => s.closeSettings);

  const isOpen = propIsOpen ?? storeIsOpen;
  const onClose = propOnClose ?? storeClose;

  const [activeTab, setActiveTab] = useState<SettingsTab>(
    SettingsTab.PROVIDERS,
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="w-[92vw] max-w-5xl h-[84vh] max-h-180 min-h-125 p-0 gap-0 overflow-hidden flex flex-row rounded-2xl border border-border bg-card text-card-foreground shadow-2xl sm:max-w-5xl"
      >
        <SettingsSidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-background">
          <DialogHeader className="flex flex-row items-start justify-between px-6 py-5 border-b border-border space-y-0">
            <div>
              <DialogTitle className="text-xl font-semibold tracking-tight text-foreground">
                {TAB_TITLES[activeTab].title}
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {TAB_TITLES[activeTab].subtitle}
              </DialogDescription>
            </div>

            <DialogClose
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Close (Esc)"
                />
              }
            >
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
            {activeTab === SettingsTab.PROVIDERS && <ProvidersTab />}
            {activeTab === SettingsTab.MODELS && <ModelsTab />}
            {activeTab === SettingsTab.APPEARANCE && <AppearanceTab />}
            {activeTab === SettingsTab.GENERAL && (
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
      </DialogContent>
    </Dialog>
  );
}
