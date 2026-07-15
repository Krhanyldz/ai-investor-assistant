import type {
  BasicFinancialMetrics,
  CompanyProfile,
  MarketDataResult,
  StockQuote,
} from "@/domain/market-data";

export interface MarketDataProvider {
  getQuote(symbol: string): Promise<MarketDataResult<StockQuote>>;
  getCompanyProfile(symbol: string): Promise<MarketDataResult<CompanyProfile>>;
  getBasicFinancials(symbol: string): Promise<MarketDataResult<BasicFinancialMetrics>>;
}
