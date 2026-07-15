import type {
  BasicFinancialMetrics,
  CompanyProfile,
  MarketDataResult,
  MarketDataSource,
  StockQuote,
} from "@/domain/market-data";

function createDevelopmentSource(symbol: string): MarketDataSource {
  const now = new Date().toISOString();

  return {
    provider: "development-mock",
    retrievedAt: now,
    dataTimestamp: now,
    isFallback: true,
    label: `Development mock data for ${symbol}. Not live market data.`,
  };
}

export function createDevelopmentQuote(symbol: string): MarketDataResult<StockQuote> {
  const normalizedSymbol = symbol.toUpperCase();

  return {
    ok: true,
    data: {
      symbol: normalizedSymbol,
      currentPrice: 188.42,
      change: 1.24,
      percentChange: 0.66,
      highPrice: 190.1,
      lowPrice: 186.8,
      openPrice: 187.05,
      previousClose: 187.18,
      source: createDevelopmentSource(normalizedSymbol),
    },
  };
}

export function createDevelopmentCompanyProfile(symbol: string): MarketDataResult<CompanyProfile> {
  const normalizedSymbol = symbol.toUpperCase();

  return {
    ok: true,
    data: {
      symbol: normalizedSymbol,
      name: `${normalizedSymbol} Development Sample Inc.`,
      exchange: "Sample Exchange",
      currency: "USD",
      country: "US",
      industry: "Development mock",
      marketCapitalization: 250_000,
      shareOutstanding: 1_000,
      webUrl: "https://example.com",
      source: createDevelopmentSource(normalizedSymbol),
    },
  };
}

export function createDevelopmentBasicFinancials(symbol: string): MarketDataResult<BasicFinancialMetrics> {
  const normalizedSymbol = symbol.toUpperCase();

  return {
    ok: true,
    data: {
      symbol: normalizedSymbol,
      metric: {
        marketCapitalization: 250_000,
        peBasicExclExtraTTM: 24.8,
        revenueGrowthTTMYoy: 0.08,
      },
      source: createDevelopmentSource(normalizedSymbol),
    },
  };
}
