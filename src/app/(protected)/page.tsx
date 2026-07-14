import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";

export default function ProtectedHomePage() {
  return (
    <DashboardLayout
      title="Dashboard"
      description="A premium dashboard shell for your authenticated workspace."
    />
  );
}
