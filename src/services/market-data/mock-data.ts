import type {
  AssetSearchResult,
  BasicFinancialMetrics,
  CompanyProfile,
  MarketDataResult,
  MarketDataSource,
  StockQuote,
} from "@/domain/market-data";

const developmentAssets: AssetSearchResult[] = [
  { symbol: "AAPL", displaySymbol: "AAPL", name: "Apple Inc. (Development Sample)", type: "Common Stock" },
  { symbol: "MSFT", displaySymbol: "MSFT", name: "Microsoft Corp. (Development Sample)", type: "Common Stock" },
  { symbol: "NVDA", displaySymbol: "NVDA", name: "NVIDIA Corp. (Development Sample)", type: "Common Stock" },
  { symbol: "VTI", displaySymbol: "VTI", name: "Vanguard Total Stock Market ETF (Development Sample)", type: "ETP" },
  { symbol: "SPY", displaySymbol: "SPY", name: "SPDR S&P 500 ETF Trust (Development Sample)", type: "ETP" },
  { symbol: "QQQ", displaySymbol: "QQQ", name: "Invesco QQQ Trust ETF (Development Sample)", type: "ETP" },
];

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

export function createDevelopmentSearchResults(query: string): MarketDataResult<AssetSearchResult[]> {
  const normalized = query.trim().toLowerCase();
  const matches = developmentAssets.filter(
    (asset) => asset.symbol.toLowerCase().includes(normalized) || asset.name.toLowerCase().includes(normalized),
  );

  return {
    ok: true,
    data: matches,
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
