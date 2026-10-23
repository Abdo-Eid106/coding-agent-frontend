import { useState } from "react";
import { Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAddCustomProvider } from "../hooks/provider.queries";
import type { AddCustomProviderDto } from "../types";
import { toast } from "@/features/main/components/Toaster";
import { getErrorMessage } from "@/shared/lib/get-error-message";

type Pair = { id: string; a: string; b: string };
type SetPairs = React.Dispatch<React.SetStateAction<Pair[]>>;

const newPair = (): Pair => ({ id: crypto.randomUUID(), a: "", b: "" });

interface CustomProviderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack?: () => void;
  onSubmit?: (value: AddCustomProviderDto) => void;
  onSuccess?: () => void;
}

function PairRows({
  rows,
  setRows,
  placeholders,
  removeLabel,
  addLabel,
}: {
  rows: Pair[];
  setRows: SetPairs;
  placeholders: [string, string];
  removeLabel: string;
  addLabel: string;
}) {
  const update = (id: string, key: "a" | "b", value: string) =>
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [key]: value } : r)),
    );

  const remove = (id: string) =>
    setRows((prev) =>
      prev.length > 1 ? prev.filter((r) => r.id !== id) : [newPair()],
    );

  return (
    <div className="flex flex-col gap-3">
      {rows.map((row) => (
        <div key={row.id} className="flex items-center gap-3">
          <Input
            placeholder={placeholders[0]}
            value={row.a}
            onChange={(e) => update(row.id, "a", e.target.value)}
            required
          />
          <Input
            placeholder={placeholders[1]}
            value={row.b}
            onChange={(e) => update(row.id, "b", e.target.value)}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={removeLabel}
            className="shrink-0 text-muted-foreground"
            onClick={() => remove(row.id)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="w-fit justify-start gap-2 px-2"
        onClick={() => setRows((prev) => [...prev, newPair()])}
      >
        <Plus className="size-4 text-muted-foreground" />
        {addLabel}
      </Button>
    </div>
  );
}

export default function CustomProviderModal({
  open,
  onOpenChange,
  onSubmit,
  onSuccess,
}: CustomProviderModalProps) {
  const [providerId, setProviderId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [models, setModels] = useState<Pair[]>([newPair()]);

  const { mutate: addCustomProvider, isPending } = useAddCustomProvider();

  const resetForm = () => {
    setProviderId("");
    setDisplayName("");
    setBaseUrl("");
    setApiKey("");
    setModels([newPair()]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validModels = models
      .map((m) => ({
        modelId: m.a.trim(),
        displayName: m.b.trim(),
      }))
      .filter((m) => m.modelId && m.displayName);

    if (validModels.length === 0) {
      toast.error(
        "Please provide both Model ID and Display Name for at least one model",
      );
      return;
    }

    const payload: AddCustomProviderDto = {
      providerId: providerId.trim(),
      displayName: displayName.trim(),
      baseUrl: baseUrl.trim(),
      apiKey: apiKey.trim(),
      models: validModels,
    };

    addCustomProvider(payload, {
      onSuccess: () => {
        toast.success(`Custom provider "${payload.displayName}" added`);
        resetForm();
        onOpenChange(false);
        onSubmit?.(payload);
        onSuccess?.();
      },
      onError: (err) => {
        toast.error(getErrorMessage(err));
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        className="flex h-[min(90vh,760px)] max-w-3xl flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl z-70"
      >
        <ScrollArea className="min-h-0 flex-1">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 px-8 py-10"
          >
            <DialogHeader className="gap-4 text-left">
              <div className="flex items-center gap-4">
                <Sparkles className="size-5" />
                <DialogTitle className="text-xl">Custom provider</DialogTitle>
              </div>
              <DialogDescription>
                Configure an OpenAI-compatible provider.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-2">
              <Label htmlFor="provider-id">Provider ID</Label>
              <Input
                id="provider-id"
                placeholder="myprovider"
                value={providerId}
                onChange={(e) => setProviderId(e.target.value)}
                pattern="[a-z0-9_\-]+"
                required
              />
              <p className="text-sm text-muted-foreground">
                Lowercase letters, numbers, hyphens, or underscores
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="display-name">Display name</Label>
              <Input
                id="display-name"
                placeholder="My AI Provider"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="base-url">Base URL</Label>
              <Input
                id="base-url"
                type="url"
                placeholder="https://api.myprovider.com/v1"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="api-key">API key</Label>
              <Input
                id="api-key"
                type="password"
                autoComplete="off"
                placeholder="API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label>Models</Label>
              <PairRows
                rows={models}
                setRows={setModels}
                placeholders={["model-id", "Display Name"]}
                removeLabel="Remove model"
                addLabel="Add model"
              />
            </div>

            <Button type="submit" className="w-fit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
