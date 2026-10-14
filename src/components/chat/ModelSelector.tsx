import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, Check, Info } from "lucide-react";
import { AVAILABLE_MODELS } from "../../store/models";
import { useChatStore } from "../../store/useChatStore";
import Dropdown from "../Dropdown";

interface ModelSelectorProps {
  selectedModel?: string;
  onSelectModel?: (model: string, modelId?: string) => void;
}

export default function ModelSelector({
  selectedModel: propModel,
  onSelectModel: propOnSelect,
}: ModelSelectorProps = {}) {
  const storeSelectedModel = useChatStore((s) => s.selectedModel);
  const storeSetSelectedModel = useChatStore((s) => s.setSelectedModel);

  const selectedModel = propModel ?? storeSelectedModel;
  const onSelectModel = propOnSelect ?? storeSetSelectedModel;

  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs text-muted-foreground hover:bg-accent transition-colors cursor-pointer"
      >
        {selectedModel}
        {isOpen ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
      </button>

      <Dropdown
        isOpen={isOpen}
        direction="up"
        className="absolute bottom-full mb-2 left-0 z-50"
      >
        <div className="min-w-[320px] max-h-64 flex flex-col rounded-lg border border-border bg-popover text-popover-foreground shadow-lg overflow-hidden">
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0 border-b border-border/50">
            Model
          </div>
          <div className="overflow-y-auto py-1">
            {AVAILABLE_MODELS.map((model) => {
              const isSelected = model.name === selectedModel;
              return (
                <button
                  key={model.name}
                  type="button"
                  onClick={() => {
                    if (!model.available) return;
                    onSelectModel(model.name, model.id);
                    setIsOpen(false);
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
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        {model.tag}
                      </span>
                    )}
                  </div>
                  {isSelected && <Check className="size-4 text-primary" />}
                </button>
              );
            })}
          </div>
          <div className="px-3 py-2 border-t border-border/50 bg-muted/30 text-[11px] text-muted-foreground flex items-center gap-1.5">
            <Info className="size-3 shrink-0" />
            <span>Rate limits may apply based on provider quota</span>
          </div>
        </div>
      </Dropdown>
    </div>
  );
}
