import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { DemoWorkspace } from "@/features/dashboard/components/demo-workspace";

export default function AiResearchPage() {
  return (
    <DashboardLayout
      title="AI Research"
      description="A sample AI research workspace for future insight summaries and notes."
    >
      <DemoWorkspace workspace="ai-research" />
    </DashboardLayout>
  );
}
