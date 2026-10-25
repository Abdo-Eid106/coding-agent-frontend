import { useState } from "react";
import { ChevronDown, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useFetchMcpServers, useReloadMcpServers } from "../hooks/mcps.queries";
import type { McpServerDto } from "../types";

function McpServerRow({ server }: { server: McpServerDto }) {
  const [open, setOpen] = useState(false);
  const connected = server.status === "connected";
  const count = server.tools.length;

  return (
    <li className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <h4 className="text-sm font-medium text-foreground">{server.name}</h4>
        <span
          className={cn(
            "size-2 rounded-full",
            connected ? "bg-emerald-500" : "bg-destructive",
          )}
          title={connected ? "Connected" : "Failed to connect"}
        />
      </div>

      {connected ? (
        <Collapsible open={open} onOpenChange={setOpen} className="mt-1">
          <CollapsibleTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <ChevronDown
              className={cn(
                "size-3.5 transition-transform",
                open && "rotate-180",
              )}
            />
            {count} {count === 1 ? "tool" : "tools"} enabled
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="mt-3 flex flex-wrap gap-2">
              {server.tools.map((tool) => (
                <Badge
                  key={tool.name}
                  variant="outline"
                  title={tool.description}
                  className="font-normal"
                >
                  {tool.displayName}
                </Badge>
              ))}
              {count === 0 && (
                <p className="text-xs text-muted-foreground">
                  This server doesn't expose any tools.
                </p>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <p className="mt-1 text-xs text-destructive">
          Couldn't connect. Check the command or URL in your MCP config.
        </p>
      )}
    </li>
  );
}

export function McpServersTab() {
  const { data, isLoading, isError, refetch } = useFetchMcpServers();
  const reload = useReloadMcpServers();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium text-foreground">
          Installed MCP servers
        </h3>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            title="Reload MCP servers"
            onClick={() => reload.mutate()}
            disabled={reload.isPending}
          >
            <RefreshCw
              className={cn("size-4", reload.isPending && "animate-spin")}
            />
            <span className="sr-only">Reload MCP servers</span>
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      )}

      {isError && (
        <p className="text-sm text-destructive">
          Couldn't load your MCP servers.{" "}
          <button type="button" className="underline" onClick={() => refetch()}>
            Retry
          </button>
        </p>
      )}

      {reload.isError && (
        <p className="text-sm text-destructive">Couldn't reload the servers.</p>
      )}

      {data && data.length === 0 && (
        <div className="rounded-xl border border-dashed border-border p-8 text-center">
          <p className="text-sm font-medium text-foreground">
            No MCP servers yet
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add servers to your MCP config file, then reload.
          </p>
        </div>
      )}

      {data && data.length > 0 && (
        <ul className="space-y-3">
          {data.map((server) => (
            <McpServerRow key={server.name} server={server} />
          ))}
        </ul>
      )}
    </section>
  );
}
