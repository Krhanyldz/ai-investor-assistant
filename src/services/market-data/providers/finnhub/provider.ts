import type {
  AssetSearchResult,
  BasicFinancialMetrics,
  CompanyProfile,
  MarketDataResult,
  MarketDataSource,
  StockQuote,
} from "@/domain/market-data";
import type { MarketDataProvider } from "@/services/market-data/types";
import { fetchFinnhubJson } from "@/services/market-data/providers/finnhub/client";
import type {
  FinnhubBasicFinancialsResponse,
  FinnhubCompanyProfileResponse,
  FinnhubQuoteResponse,
  FinnhubSymbolSearchResponse,
} from "@/services/market-data/providers/finnhub/types";

function normalizeSymbol(symbol: string) {
  return symbol.trim().toUpperCase();
}

function createSource(dataTimestamp?: number): MarketDataSource {
  const retrievedAt = new Date().toISOString();

  return {
    provider: "finnhub",
    retrievedAt,
    dataTimestamp: dataTimestamp ? new Date(dataTimestamp * 1000).toISOString() : retrievedAt,
    isFallback: false,
    label: "Finnhub",
  };
}

function invalidResponse<T>(message: string): MarketDataResult<T> {
  return {
    ok: false,
    error: {
      code: "invalid_provider_response",
      message,
      provider: "finnhub",
    },
  };
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function parseQuote(symbol: string, response: FinnhubQuoteResponse): MarketDataResult<StockQuote> {
  if (
    !isNumber(response.c) ||
    !isNumber(response.d) ||
    !isNumber(response.dp) ||
    !isNumber(response.h) ||
    !isNumber(response.l) ||
    !isNumber(response.o) ||
    !isNumber(response.pc)
  ) {
    return invalidResponse("Finnhub quote response was missing required numeric fields.");
  }

  if (response.c === 0 && response.pc === 0) {
    return {
      ok: false,
      error: {
        code: "not_found",
        message: `No Finnhub quote data found for ${symbol}.`,
        provider: "finnhub",
      },
    };
  }

  return {
    ok: true,
    data: {
      symbol,
      currentPrice: response.c,
      change: response.d,
      percentChange: response.dp,
      highPrice: response.h,
      lowPrice: response.l,
      openPrice: response.o,
      previousClose: response.pc,
      source: createSource(response.t),
    },
  };
}

function parseCompanyProfile(symbol: string, response: FinnhubCompanyProfileResponse): MarketDataResult<CompanyProfile> {
  if (!response.name) {
    return {
      ok: false,
      error: {
        code: "not_found",
        message: `No Finnhub company profile found for ${symbol}.`,
        provider: "finnhub",
      },
    };
  }

  return {
    ok: true,
    data: {
      symbol: response.ticker ?? symbol,
      name: response.name,
      exchange: response.exchange,
      currency: response.currency,
      country: response.country,
      industry: response.finnhubIndustry,
      ipo: response.ipo,
      marketCapitalization: response.marketCapitalization,
      shareOutstanding: response.shareOutstanding,
      logo: response.logo,
      webUrl: response.weburl,
      source: createSource(),
    },
  };
}

function parseBasicFinancials(
  symbol: string,
  response: FinnhubBasicFinancialsResponse,
): MarketDataResult<BasicFinancialMetrics> {
  if (!response.metric || Object.keys(response.metric).length === 0) {
    return {
      ok: false,
      error: {
        code: "not_found",
        message: `No Finnhub basic financial metrics found for ${symbol}.`,
        provider: "finnhub",
      },
    };
  }

  return {
    ok: true,
    data: {
      symbol: response.symbol ?? symbol,
      metric: response.metric,
      source: createSource(),
    },
  };
}

export class FinnhubMarketDataProvider implements MarketDataProvider {
  async searchAssets(query: string): Promise<MarketDataResult<AssetSearchResult[]>> {
    const normalizedQuery = query.trim();
    if (normalizedQuery.length < 1 || normalizedQuery.length > 80) return invalidResponse("Search query must contain 1–80 characters.");
    const response = await fetchFinnhubJson<FinnhubSymbolSearchResponse>({ endpoint: "/search", params: { q: normalizedQuery } });
    if (!response.ok) return response;
    if (!Array.isArray(response.data.result)) return invalidResponse("Finnhub search response was missing its result list.");
    return { ok: true, data: response.data.result.flatMap((item) => item.symbol && item.description ? [{ symbol: item.symbol, displaySymbol: item.displaySymbol ?? item.symbol, name: item.description, type: item.type ?? "Unknown" }] : []).slice(0, 25) };
  }
  async getQuote(symbol: string): Promise<MarketDataResult<StockQuote>> {
    const normalizedSymbol = normalizeSymbol(symbol);
    const response = await fetchFinnhubJson<FinnhubQuoteResponse>({
      endpoint: "/quote",
      params: { symbol: normalizedSymbol },
    });

    return response.ok ? parseQuote(normalizedSymbol, response.data) : response;
  }

  async getCompanyProfile(symbol: string): Promise<MarketDataResult<CompanyProfile>> {
    const normalizedSymbol = normalizeSymbol(symbol);
    const response = await fetchFinnhubJson<FinnhubCompanyProfileResponse>({
      endpoint: "/stock/profile2",
      params: { symbol: normalizedSymbol },
    });

    return response.ok ? parseCompanyProfile(normalizedSymbol, response.data) : response;
  }

  async getBasicFinancials(symbol: string): Promise<MarketDataResult<BasicFinancialMetrics>> {
    const normalizedSymbol = normalizeSymbol(symbol);
    const response = await fetchFinnhubJson<FinnhubBasicFinancialsResponse>({
      endpoint: "/stock/metric",
      params: { symbol: normalizedSymbol, metric: "all" },
    });

    return response.ok ? parseBasicFinancials(normalizedSymbol, response.data) : response;
  }
}
