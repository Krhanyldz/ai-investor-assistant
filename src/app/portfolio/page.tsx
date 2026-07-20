import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { PortfolioView } from "@/features/portfolio/components/portfolio-view";
import { getPortfolioPositions } from "@/features/portfolio/lib/actions";

export default async function PortfolioPage() {
  const result = await getPortfolioPositions();
  return (
    <DashboardLayout
      title="Portfolio"
      description="Track manually entered holdings and their cost basis. Values are not personalized advice."
    >
      <PortfolioView positions={result.positions} error={result.error} />
    </DashboardLayout>
  );
}
