import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { DemoWorkspace } from "@/features/dashboard/components/demo-workspace";

export default function SettingsPage() {
  return (
    <DashboardLayout
      title="Settings"
      description="A sample settings workspace for future preferences and alert configuration."
    >
      <DemoWorkspace workspace="settings" />
    </DashboardLayout>
  );
}
