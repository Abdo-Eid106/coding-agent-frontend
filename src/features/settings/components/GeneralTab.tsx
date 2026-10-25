import { CommandApprovalSelect } from "./CommandAprrovalMode";

export default function GeneralTab() {
  return (
    <div className="space-y-6">
      <section className="space-y-4 rounded-xl border border-border bg-card p-5">
        <div>
          <h3 className="text-sm font-medium text-foreground">
            Agent behavior
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Control how much the agent can do without asking you first.
          </p>
        </div>

        <CommandApprovalSelect />
      </section>
    </div>
  );
}
