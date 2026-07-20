import type { MarketDataSource } from "@/domain/market-data";

export const personalizedAdviceRefusal =
  "I can help you research the asset, its valuation, risks, financials, scenarios, and alternatives, but I cannot provide a personalized investment recommendation.";

export interface ResearchAnalysis {
  companySummary: string;
  valuationOverview: string;
  bullCase: string[];
  bearCase: string[];
  keyRisks: string[];
  catalysts: string[];
  assumptions: string[];
  facts: string[];
  estimates: string[];
  aiInterpretation: string[];
  sourcesUsed: string[];
  evidenceQuality: "low" | "medium" | "high";
  generatedAt: string;
  marketDataTimestamp: string;
  model: string;
}

export type ResearchAnalysisResult =
  | { ok: true; data: ResearchAnalysis }
  | { ok: false; code: "refused" | "missing_api_key" | "provider_error" | "invalid_response"; message: string };

export interface ResearchContext {
  symbol: string;
  question?: string;
  companyName?: string;
  currentPrice?: number;
  currency?: string;
  metrics?: Record<string, number | string | null>;
  sources: MarketDataSource[];
}
