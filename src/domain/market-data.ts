export type MarketDataProviderName = "finnhub" | "development-mock";

export type MarketDataErrorCode =
  | "missing_api_key"
  | "provider_rate_limited"
  | "provider_unavailable"
  | "invalid_provider_response"
  | "not_found";

export interface MarketDataError {
  code: MarketDataErrorCode;
  message: string;
  provider: MarketDataProviderName;
  retryAfterSeconds?: number;
}

export type MarketDataResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: MarketDataError };

export interface MarketDataSource {
  provider: MarketDataProviderName;
  retrievedAt: string;
  dataTimestamp: string;
  isFallback: boolean;
  label: string;
}

export interface StockQuote {
  symbol: string;
  currentPrice: number;
  change: number;
  percentChange: number;
  highPrice: number;
  lowPrice: number;
  openPrice: number;
  previousClose: number;
  source: MarketDataSource;
}

export interface CompanyProfile {
  symbol: string;
  name: string;
  exchange?: string;
  currency?: string;
  country?: string;
  industry?: string;
  ipo?: string;
  marketCapitalization?: number;
  shareOutstanding?: number;
  logo?: string;
  webUrl?: string;
  source: MarketDataSource;
}

export interface BasicFinancialMetrics {
  symbol: string;
  metric: Record<string, number | string | null>;
  source: MarketDataSource;
}
