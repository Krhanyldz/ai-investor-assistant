import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";

export default function AiResearchLoading() {
  return (
    <DashboardLayout
      title="AI Research"
      description="Generating structured, source-bound research analysis."
    >
      <div role="status" aria-label="Loading AI research" className="space-y-6 animate-pulse">
        <div className="h-14 rounded-lg bg-zinc-900" />
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="h-36 rounded-lg bg-zinc-900" />
          <div className="h-36 rounded-lg bg-zinc-900" />
          <div className="h-36 rounded-lg bg-zinc-900" />
          <div className="h-36 rounded-lg bg-zinc-900" />
        </div>
      </div>
    </DashboardLayout>
  );
}
