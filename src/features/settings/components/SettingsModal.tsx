import { useState } from "react";
import { X } from "lucide-react";
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
import type { Modal } from "@/shared/hooks/useModal";
import GeneralTab from "./GeneralTab";
import { McpServersTab } from "@/features/mcps/components/McpServerTab";

interface SettingsModalProps {
  modal: Modal;
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
  [SettingsTab.MCP]: {
    title: "MCP servers",
    subtitle: "Manage the Model Context Protocol servers your agent can use.",
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

export default function SettingsModal({ modal }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>(
    SettingsTab.PROVIDERS,
  );

  return (
    <Dialog open={modal.isOpen} onOpenChange={(open) => !open && modal.close()}>
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
            {activeTab === SettingsTab.MCP && <McpServersTab />}
            {activeTab === SettingsTab.GENERAL && <GeneralTab />}
            {activeTab === SettingsTab.APPEARANCE && <AppearanceTab />}
          </div>
        </main>
      </DialogContent>
    </Dialog>
  );
}
