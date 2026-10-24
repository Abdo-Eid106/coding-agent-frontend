import { Trash2, Pencil, Globe } from "lucide-react";
import type { ProviderDto } from "@/features/providers/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SelectionModal } from "@/shared/hooks/useSelectionModal";

interface ProviderCardProps {
  provider: ProviderDto;
  deleteModal: SelectionModal<ProviderDto>;
  editModal: SelectionModal<ProviderDto>;
}

export default function ProviderCard({
  provider,
  deleteModal,
  editModal,
}: ProviderCardProps) {
  const modelsCount = provider.models?.length || 0;
  const modelsList =
    provider.models && provider.models.length > 0
      ? provider.models.map((m) => m.displayName || m.id).join(", ")
      : "No models configured";

  return (
    <Card className="p-5 gap-3">
      {/* Header */}
      <CardHeader className="p-0 flex flex-row items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-10 rounded-lg flex items-center justify-center border border-border bg-muted/50 text-foreground shrink-0">
            <Globe className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-base font-semibold truncate">
                {provider.displayName}
              </CardTitle>
              <Badge variant="secondary" className="text-[11px] font-medium">
                {modelsCount} {modelsCount === 1 ? "model" : "models"}
              </Badge>
            </div>
            <CardDescription className="text-xs mt-0.5 truncate font-mono">
              {provider.baseUrl || ""}
            </CardDescription>
          </div>
        </div>

        <CardAction className="flex items-center gap-1.5 shrink-0 mt-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editModal.open(provider)}
            className="h-8 gap-1 px-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            title="Edit provider"
          >
            <Pencil className="size-3.5" />
            <span>Edit</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => deleteModal.open(provider)}
            className="h-8 gap-1 px-2.5 text-xs text-muted-foreground hover:text-destructive cursor-pointer"
            title="Delete provider"
          >
            <Trash2 className="size-3.5" />
            <span>Delete</span>
          </Button>
        </CardAction>
      </CardHeader>

      {/* Models preview */}
      <CardContent className="p-0 text-xs text-muted-foreground pt-3 border-t border-border/40">
        <span className="font-medium text-foreground/80">Models: </span>
        <span className="line-clamp-1">{modelsList}</span>
      </CardContent>
    </Card>
  );
}
