import type {
  AssetSearchResult,
  BasicFinancialMetrics,
  CompanyProfile,
  MarketDataResult,
  StockQuote,
} from "@/domain/market-data";

export interface MarketDataProvider {
  searchAssets(query: string): Promise<MarketDataResult<AssetSearchResult[]>>;
  getQuote(symbol: string): Promise<MarketDataResult<StockQuote>>;
  getCompanyProfile(symbol: string): Promise<MarketDataResult<CompanyProfile>>;
  getBasicFinancials(symbol: string): Promise<MarketDataResult<BasicFinancialMetrics>>;
}
