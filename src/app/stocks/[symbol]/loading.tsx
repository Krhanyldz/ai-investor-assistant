import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { StockResearchSkeleton } from "@/features/stocks/components/stock-research-skeleton";

export default function StockResearchLoading() {
  return (
    <DashboardLayout
      title="Stock Research"
      description="Loading company quote, profile, and financial metrics."
    >
      <StockResearchSkeleton />
    </DashboardLayout>
  );
}
