import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AddProviderDto, ProviderDto } from "../types";
import { useProviderForm } from "../hooks/useProviderForm";

export interface ProviderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading?: boolean;
  onSubmit: (data: AddProviderDto) => void;
  initialData?: ProviderDto | null;
  isEdit?: boolean;
}

type ProviderFormContentProps = Omit<
  ProviderFormProps,
  "open" | "onOpenChange"
>;

const COPY = {
  create: {
    idHint: "Lowercase letters, numbers, hyphens, or underscores",
    submit: "Submit",
    pending: "Adding...",
  },
  edit: {
    idHint: "Provider ID cannot be modified.",
    submit: "Save Changes",
    pending: "Saving...",
  },
} as const;

export function ProviderForm({
  isLoading = false,
  onSubmit,
  initialData,
  isEdit = false,
}: ProviderFormContentProps) {
  const { register, fields, addModel, removeModel, handleFormSubmit } =
    useProviderForm({ initialData, onSubmit });
  const copy = isEdit ? COPY.edit : COPY.create;

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
      {/* A disabled fieldset disables every control inside it. */}
      <fieldset disabled={isLoading} className="flex min-w-0 flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="provider-id">Provider ID</Label>
          <Input
            id="provider-id"
            placeholder="myprovider"
            disabled={isEdit}
            required
            {...register("id")}
          />
          <p className="text-sm text-muted-foreground">{copy.idHint}</p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="display-name">Display name</Label>
          <Input
            id="display-name"
            placeholder="My AI Provider"
            required
            {...register("displayName")}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="base-url">Base URL</Label>
          <Input
            id="base-url"
            type="url"
            placeholder="https://api.myprovider.com/v1"
            {...register("baseUrl")}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="api-key">API key</Label>
          <Input
            id="api-key"
            type="password"
            autoComplete="off"
            placeholder="API key"
            {...register("apiKey")}
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label>Models</Label>
            <span className="text-xs text-muted-foreground">
              At least one model is required
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-3">
                <Input
                  placeholder="Model ID (e.g. llama-3.3-70b)"
                  required
                  {...register(`models.${index}.id`)}
                />
                <Input
                  placeholder="Display Name (e.g. Llama 3.3 70B)"
                  required
                  {...register(`models.${index}.displayName`)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Remove model"
                  className="shrink-0 cursor-pointer text-muted-foreground transition-colors hover:text-destructive"
                  onClick={() => removeModel(index)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-fit cursor-pointer justify-start gap-2 px-2"
              onClick={addModel}
            >
              <Plus className="size-4 text-muted-foreground" />
              Add model
            </Button>
          </div>
        </div>

        <Button type="submit" className="w-fit cursor-pointer">
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>{copy.pending}</span>
            </>
          ) : (
            copy.submit
          )}
        </Button>
      </fieldset>
    </form>
  );
}
