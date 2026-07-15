import { demoMetrics, demoSections, demoWorkspaces } from "@/features/dashboard/data/demo-content";
import { PanelCard } from "@/features/dashboard/components/panel-card";
import { StatCard } from "@/features/dashboard/components/stat-card";

interface DemoWorkspaceProps {
  workspace: keyof typeof demoWorkspaces;
}

export function DemoWorkspace({ workspace }: DemoWorkspaceProps) {
  const content = demoWorkspaces[workspace];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {demoMetrics.map((metric) => (
          <StatCard key={metric.label} label={metric.label} value={metric.value} change={metric.change} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.9fr]">
        <PanelCard title={content.title} description={content.description}>
          <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-1">
            {content.items.map((item) => (
              <div key={item.label} className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4">
                <p className="text-sm font-medium text-zinc-300">{item.label}</p>
                <p className="mt-3 text-xl font-semibold text-zinc-100">{item.value}</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{item.detail}</p>
              </div>
            ))}
          </div>
        </PanelCard>

        <PanelCard title="Sample implementation notes" description="Scope intentionally excludes live integrations.">
          <div className="space-y-3 text-sm text-zinc-400">
            {demoSections.map((section) => (
              <div key={section.title} className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
                <p className="font-medium text-zinc-200">{section.title}</p>
                <p className="mt-2 leading-6">{section.description}</p>
              </div>
            ))}
            <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-3 text-emerald-100">
              Demo/sample data only. No API integration, authentication, or charts are active.
            </div>
          </div>
        </PanelCard>
      </div>
    </div>
  );
}
