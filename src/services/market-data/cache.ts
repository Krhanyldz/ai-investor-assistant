import type { MarketDataResult } from "@/domain/market-data";

interface CacheEntry<T> {
  expiresAt: number;
  result: MarketDataResult<T>;
}

export class MarketDataCache {
  private readonly entries = new Map<string, CacheEntry<unknown>>();

  constructor(private readonly ttlMs: number) {}

  async getOrSet<T>(key: string, load: () => Promise<MarketDataResult<T>>): Promise<MarketDataResult<T>> {
    const now = Date.now();
    const cached = this.entries.get(key) as CacheEntry<T> | undefined;

    if (cached && cached.expiresAt > now) {
      return cached.result;
    }

    const result = await load();

    if (result.ok) {
      this.entries.set(key, {
        expiresAt: now + this.ttlMs,
        result,
      });
    }

    return result;
  }

  clear() {
    this.entries.clear();
  }
}

export const marketDataCache = new MarketDataCache(60_000);
