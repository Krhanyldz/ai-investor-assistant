import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { StockResearchPage } from "@/features/stocks/components/stock-research-page";
import {
  getBasicFinancials,
  getCompanyProfile,
  getStockQuote,
} from "@/services/market-data";

interface StockResearchRouteProps {
  params: Promise<{
    symbol: string;
  }>;
}

function normalizeSymbol(symbol: string) {
  return symbol.trim().toUpperCase();
}

export default async function StockResearchRoute({ params }: StockResearchRouteProps) {
  const { symbol: symbolParam } = await params;
  const symbol = normalizeSymbol(symbolParam);
  const [quoteResult, profileResult, financialsResult] = await Promise.all([
    getStockQuote(symbol),
    getCompanyProfile(symbol),
    getBasicFinancials(symbol),
  ]);

  return (
    <DashboardLayout
      title={`${symbol} Research`}
      description="Professional stock research page powered by server-side market data provider results."
    >
      <StockResearchPage
        symbol={symbol}
        quoteResult={quoteResult}
        profileResult={profileResult}
        financialsResult={financialsResult}
      />
    </DashboardLayout>
  );
}
