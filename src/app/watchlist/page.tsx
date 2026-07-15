import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { DemoWorkspace } from "@/features/dashboard/components/demo-workspace";

export default function WatchlistPage() {
  return (
    <DashboardLayout
      title="Watchlist"
      description="A sample watchlist workspace for tracking ideas and upcoming research notes."
    >
      <DemoWorkspace workspace="watchlist" />
    </DashboardLayout>
  );
}
