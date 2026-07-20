import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { ResearchAnalysisView } from "@/features/ai-research/components/research-analysis";
import { generateResearchAnalysis } from "@/services/ai-research";
import { getBasicFinancials, getCompanyProfile, getStockQuote } from "@/services/market-data";
import type { MarketDataSource } from "@/domain/market-data";

export default async function AiResearchSymbolPage({ params, searchParams }: { params: Promise<{ symbol: string }>; searchParams: Promise<{ question?: string }> }) {
  const { symbol: rawSymbol } = await params;
  const { question } = await searchParams;
  const symbol = rawSymbol.trim().toUpperCase();
  const [quoteResult, profileResult, financialsResult] = await Promise.all([getStockQuote(symbol), getCompanyProfile(symbol), getBasicFinancials(symbol)]);
  const quote = quoteResult.ok ? quoteResult.data : undefined;
  const profile = profileResult.ok ? profileResult.data : undefined;
  const financials = financialsResult.ok ? financialsResult.data : undefined;
  const sources = [quote?.source, profile?.source, financials?.source].filter((source): source is MarketDataSource => Boolean(source));
  const result = await generateResearchAnalysis({ symbol, question, companyName: profile?.name, currentPrice: quote?.currentPrice, currency: profile?.currency, metrics: financials?.metric, sources });
  return <DashboardLayout title={`${symbol} AI Research`} description="Explainable, source-bound research. Not personalized investment advice."><ResearchAnalysisView result={result} /></DashboardLayout>;
}
