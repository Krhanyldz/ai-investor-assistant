import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { DemoWorkspace } from "@/features/dashboard/components/demo-workspace";

export default function HomePage() {
  return (
    <DashboardLayout
      title="Dashboard"
      description="A premium dashboard shell with demo/sample data for future portfolio and market insights."
    >
      <DemoWorkspace workspace="dashboard" />
    </DashboardLayout>
  );
}
