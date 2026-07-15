import type {
  BasicFinancialMetrics,
  CompanyProfile,
  MarketDataResult,
  StockQuote,
} from "@/domain/market-data";
import { marketDataCache } from "@/services/market-data/cache";
import {
  createDevelopmentBasicFinancials,
  createDevelopmentCompanyProfile,
  createDevelopmentQuote,
} from "@/services/market-data/mock-data";
import { FinnhubMarketDataProvider } from "@/services/market-data/providers/finnhub/provider";
import type { MarketDataProvider } from "@/services/market-data/types";

const provider = new FinnhubMarketDataProvider();

function shouldUseDevelopmentFallback<T>(result: MarketDataResult<T>) {
  return !result.ok && process.env.NODE_ENV === "development";
}

async function withDevelopmentFallback<T>(
  load: () => Promise<MarketDataResult<T>>,
  fallback: () => MarketDataResult<T>,
): Promise<MarketDataResult<T>> {
  const result = await load();
  return shouldUseDevelopmentFallback(result) ? fallback() : result;
}

export function getMarketDataProvider(): MarketDataProvider {
  return provider;
}

export function getStockQuote(symbol: string): Promise<MarketDataResult<StockQuote>> {
  const normalizedSymbol = symbol.trim().toUpperCase();

  return marketDataCache.getOrSet(`finnhub:quote:${normalizedSymbol}`, () =>
    withDevelopmentFallback(
      () => provider.getQuote(normalizedSymbol),
      () => createDevelopmentQuote(normalizedSymbol),
    ),
  );
}

export function getCompanyProfile(symbol: string): Promise<MarketDataResult<CompanyProfile>> {
  const normalizedSymbol = symbol.trim().toUpperCase();

  return marketDataCache.getOrSet(`finnhub:profile:${normalizedSymbol}`, () =>
    withDevelopmentFallback(
      () => provider.getCompanyProfile(normalizedSymbol),
      () => createDevelopmentCompanyProfile(normalizedSymbol),
    ),
  );
}

export function getBasicFinancials(symbol: string): Promise<MarketDataResult<BasicFinancialMetrics>> {
  const normalizedSymbol = symbol.trim().toUpperCase();

  return marketDataCache.getOrSet(`finnhub:financials:${normalizedSymbol}`, () =>
    withDevelopmentFallback(
      () => provider.getBasicFinancials(normalizedSymbol),
      () => createDevelopmentBasicFinancials(normalizedSymbol),
    ),
  );
}

export { marketDataCache };
