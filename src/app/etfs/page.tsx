import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { DemoWorkspace } from "@/features/dashboard/components/demo-workspace";

export default function EtfsPage() {
  return (
    <DashboardLayout
      title="ETFs"
      description="A sample ETFs workspace prepared for allocation views and sector research."
    >
      <DemoWorkspace workspace="etfs" />
    </DashboardLayout>
  );
}
