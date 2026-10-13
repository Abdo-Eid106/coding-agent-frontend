import { useState, useRef, useEffect } from "react";
import {
  PanelLeft,
  MoreVertical,
  Mic,
  Send,
  ChevronDown,
  ChevronUp,
  FolderOpen,
  Plus,
  Check,
  Info,
} from "lucide-react";
import type { Project } from "../store/types";
import Dropdown from "./Dropdown";

interface Model {
  name: string;
  tag?: string;
  available: boolean;
}

const MODELS: Model[] = [
  { name: "Gemini 3.8 Flash", tag: "Medium", available: true },
  { name: "Claude Sonnet 4.6 (Thinking)", tag: "Notice", available: true },
  { name: "Claude Opus 4.6 (Thinking)", tag: "Notice", available: true },
  { name: "GPT-OSS 120B (Medium)", tag: "Notice", available: true },
  { name: "Claude 3.7 Sonnet (Thinking)", tag: "Notice", available: true },
  { name: "Claude 3.5 Haiku", tag: "Fast", available: true },
  { name: "GPT-4o", tag: "Omni", available: true },
  { name: "GPT-4o mini", tag: "Fast", available: true },
  { name: "o3-mini (High)", tag: "Reasoning", available: true },
  { name: "o1-preview", tag: "Reasoning", available: true },
  { name: "DeepSeek R1", tag: "Open", available: true },
  { name: "Llama 3.3 70B", tag: "Open", available: true },
  { name: "Qwen 2.5 Coder 32B", tag: "Local", available: true },
  { name: "Mistral Large 2", tag: "Notice", available: true },
  { name: "Gemini 4 Argon", tag: "Unavailable", available: false },
];

interface ChatAreaProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  activeProjectName?: string;
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (projectId: string | null) => void;
}

export default function ChatArea({
  isSidebarOpen,
  onToggleSidebar,
  projects,
  selectedProjectId,
  onSelectProject,
}: ChatAreaProps) {
  const [message, setMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState("Claude Opus 4.6 (Thinking)");
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const selectedTarget = "Local";

  const modelRef = useRef<HTMLDivElement>(null);
  const projectRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (modelRef.current && !modelRef.current.contains(e.target as Node)) {
        setModelDropdownOpen(false);
      }
      if (projectRef.current && !projectRef.current.contains(e.target as Node)) {
        setProjectDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectedProjectObj = projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="flex-1 flex flex-col h-screen bg-background">
      {/* Top bar */}
      <header className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div className="flex items-center gap-1">
          {/* Sidebar toggle */}
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-md hover:bg-accent transition-colors cursor-pointer"
            title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
          >
            <PanelLeft className="size-4 text-muted-foreground" />
          </button>
        </div>

        <button className="p-1.5 rounded-md hover:bg-accent transition-colors cursor-pointer">
          <MoreVertical className="size-4 text-muted-foreground" />
        </button>
      </header>

      {/* Chat content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Placeholder for conversation content - empty for now */}
        </div>
      </div>

      {/* Bottom input area */}
      <div className="max-w-3xl mx-auto w-full px-4 pb-4">
        {/* Project selector pill */}
        <div className="mb-3 flex justify-start">
          <div className="relative" ref={projectRef}>
            <button
              onClick={() => setProjectDropdownOpen((v) => !v)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-sm text-foreground hover:bg-accent transition-colors cursor-pointer"
            >
              <FolderOpen className="size-3.5 text-muted-foreground" />
              <span>{selectedProjectObj?.name || "Select Project"}</span>
              <ChevronDown className="size-3 text-muted-foreground" />
            </button>

            {/* Project dropdown */}
            <Dropdown
              isOpen={projectDropdownOpen}
              direction="up"
              className="absolute bottom-full mb-2 left-0 z-50"
            >
              <div className="min-w-[240px] max-h-60 flex flex-col rounded-lg border border-border bg-popover text-popover-foreground shadow-lg overflow-hidden">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0 border-b border-border/50">
                  Project
                </div>
                <div className="overflow-y-auto py-1">
                  {projects.map((project) => {
                    const isSelected = project.id === selectedProjectId;
                    return (
                      <button
                        key={project.id}
                        onClick={() => {
                          onSelectProject(isSelected ? null : project.id);
                          setProjectDropdownOpen(false);
                        }}
                        className={`flex items-center justify-between w-full px-3 py-2 text-sm cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent/50 text-popover-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <FolderOpen className="size-4 text-muted-foreground" />
                          <span>{project.name}</span>
                        </div>
                        {isSelected && <Check className="size-4 text-primary" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Dropdown>
          </div>
        </div>

        {/* Input box */}
        <div className="rounded-xl border border-border bg-card shadow-sm">
          {/* Text input */}
          <div className="px-4 pt-3 pb-2">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message…"
              rows={1}
              className="w-full resize-none bg-transparent text-foreground text-sm placeholder:text-muted-foreground focus:outline-none"
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
              }}
            />
          </div>

          {/* Bottom toolbar inside input */}
          <div className="flex items-center justify-between px-3 pb-2">
            <div className="flex items-center gap-2">
              {/* Attach button */}
              <button className="p-1 rounded hover:bg-accent transition-colors cursor-pointer">
                <Plus className="size-4 text-muted-foreground" />
              </button>

              {/* Model selector */}
              <div className="relative" ref={modelRef}>
                <button
                  onClick={() => setModelDropdownOpen((v) => !v)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs text-muted-foreground hover:bg-accent transition-colors cursor-pointer"
                >
                  {selectedModel}
                  {modelDropdownOpen ? (
                    <ChevronUp className="size-3" />
                  ) : (
                    <ChevronDown className="size-3" />
                  )}
                </button>

                {/* Model dropdown */}
                <Dropdown
                  isOpen={modelDropdownOpen}
                  direction="up"
                  className="absolute bottom-full mb-2 left-0 z-50"
                >
                  <div className="min-w-[320px] max-h-64 flex flex-col rounded-lg border border-border bg-popover text-popover-foreground shadow-lg overflow-hidden">
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0 border-b border-border/50">
                      Model
                    </div>
                    <div className="overflow-y-auto py-1">
                      {MODELS.map((model) => {
                        const isSelected = model.name === selectedModel;
                        return (
                          <button
                            key={model.name}
                            onClick={() => {
                              if (!model.available) return;
                              setSelectedModel(model.name);
                              setModelDropdownOpen(false);
                            }}
                            disabled={!model.available}
                            className={`flex items-center justify-between w-full px-3 py-2 text-sm cursor-pointer transition-colors ${
                              !model.available
                                ? "opacity-50 cursor-not-allowed text-muted-foreground"
                                : isSelected
                                  ? "bg-accent text-accent-foreground"
                                  : "hover:bg-accent/50 text-popover-foreground"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={!model.available ? "text-muted-foreground" : ""}>
                                {model.name}
                              </span>
                              {model.tag && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-muted text-muted-foreground">
                                  {model.tag}
                                  {model.tag !== "Medium" && (
                                    <Info className="size-3" />
                                  )}
                                </span>
                              )}
                            </div>
                            {isSelected && model.available && (
                              <Check className="size-4 text-primary" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </Dropdown>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Mic button */}
              <button className="p-1.5 rounded-md hover:bg-accent transition-colors cursor-pointer">
                <Mic className="size-4 text-muted-foreground" />
              </button>

              {/* Send button */}
              <button
                className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                disabled={!message.trim()}
              >
                <Send className="size-4" />
              </button>
            </div>
          </div>

          {/* Target selector */}
          <div className="px-3 pb-2">
            <button className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              <span className="size-3 border border-current rounded-sm" />
              {selectedTarget}
              <ChevronDown className="size-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
