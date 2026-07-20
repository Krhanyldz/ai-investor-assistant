import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { ResearchLauncher } from "@/features/ai-research/components/research-launcher";

export default function AiResearchPage() {
  return (
    <DashboardLayout
      title="AI Research"
      description="Generate structured, source-bound asset research without personalized recommendations."
    >
      <ResearchLauncher />
    </DashboardLayout>
  );
}
