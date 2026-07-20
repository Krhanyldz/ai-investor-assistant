import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { EtfResearchPage } from "@/features/etfs/components/etf-research-page";
import { getCompanyProfile, getStockQuote } from "@/services/market-data";

interface EtfResearchRouteProps {
  params: Promise<{
    symbol: string;
  }>;
}

function normalizeSymbol(symbol: string) {
  return symbol.trim().toUpperCase();
}

export default async function EtfResearchRoute({ params }: EtfResearchRouteProps) {
  const { symbol: symbolParam } = await params;
  const symbol = normalizeSymbol(symbolParam);
  const [quoteResult, profileResult] = await Promise.all([
    getStockQuote(symbol),
    getCompanyProfile(symbol),
  ]);

  return (
    <DashboardLayout
      title={`${symbol} ETF Research`}
      description="ETF research with explicit source, freshness, and missing-data states. No personalized investment advice."
    >
      <EtfResearchPage symbol={symbol} quoteResult={quoteResult} profileResult={profileResult} />
    </DashboardLayout>
  );
}
