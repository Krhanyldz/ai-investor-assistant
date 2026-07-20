export interface FinnhubQuoteResponse {
  c?: number;
  d?: number;
  dp?: number;
  h?: number;
  l?: number;
  o?: number;
  pc?: number;
  t?: number;
}

export interface FinnhubCompanyProfileResponse {
  country?: string;
  currency?: string;
  exchange?: string;
  finnhubIndustry?: string;
  ipo?: string;
  logo?: string;
  marketCapitalization?: number;
  name?: string;
  shareOutstanding?: number;
  ticker?: string;
  weburl?: string;
}

export interface FinnhubBasicFinancialsResponse {
  metric?: Record<string, number | string | null>;
  metricType?: string;
  series?: unknown;
  symbol?: string;
}

export interface FinnhubSymbolSearchResponse { count?: number; result?: Array<{ description?: string; displaySymbol?: string; symbol?: string; type?: string }> }
