import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";

export default function DashboardLoading() {
  return (
    <DashboardLayout
      title="Dashboard"
      description="Loading your saved research and portfolio summary."
    >
      <div role="status" aria-label="Loading dashboard" className="space-y-6 animate-pulse">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-28 rounded-lg bg-zinc-900" />
          <div className="h-28 rounded-lg bg-zinc-900" />
          <div className="h-28 rounded-lg bg-zinc-900" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-44 rounded-lg bg-zinc-900" />
          <div className="h-44 rounded-lg bg-zinc-900" />
        </div>
      </div>
    </DashboardLayout>
  );
}
