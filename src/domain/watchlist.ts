import type { MarketDataResult, StockQuote } from "@/domain/market-data";
export interface WatchlistItem { id: string; symbol: string; createdAt: string }
export interface WatchlistRow extends WatchlistItem { quote: MarketDataResult<StockQuote> }
export interface WatchlistActionState { ok: boolean; message: string }
