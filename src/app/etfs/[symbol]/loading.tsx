import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { EtfResearchSkeleton } from "@/features/etfs/components/etf-research-skeleton";

export default function LoadingEtfResearchPage() {
  return (
    <DashboardLayout title="ETF Research" description="Loading ETF market data and fund details.">
      <EtfResearchSkeleton />
    </DashboardLayout>
  );
}
