import { Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ModelDto } from "../types";

interface ModelCardProps {
  model: ModelDto;
}

export default function ModelCard({ model }: ModelCardProps) {
  return (
    <Card className="gap-0 py-0 transition-colors hover:bg-accent/40">
      <CardContent className="flex items-center gap-3 p-3.5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Cpu className="size-4" />
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-semibold text-foreground">
            {model.displayName}
          </h4>
          <p className="truncate font-mono text-xs text-muted-foreground">
            {model.id}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Badge variant="outline" className="hidden sm:inline-flex">
            {model.provider}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
