import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { DemoWorkspace } from "@/features/dashboard/components/demo-workspace";

export default function StocksPage() {
  return (
    <DashboardLayout
      title="Stocks"
      description="A sample stocks workspace for future watchlists, research summaries, and market context."
    >
      <DemoWorkspace workspace="stocks" />
    </DashboardLayout>
  );
}
