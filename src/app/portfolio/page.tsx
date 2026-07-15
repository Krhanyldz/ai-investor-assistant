import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { DemoWorkspace } from "@/features/dashboard/components/demo-workspace";

export default function PortfolioPage() {
  return (
    <DashboardLayout
      title="Portfolio"
      description="A sample portfolio workspace for future holdings views and position analysis."
    >
      <DemoWorkspace workspace="portfolio" />
    </DashboardLayout>
  );
}
