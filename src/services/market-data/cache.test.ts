import { describe, expect, it, vi } from "vitest";
import { MarketDataCache } from "@/services/market-data/cache";

describe("MarketDataCache", () => {
  it("returns cached successful results within the TTL", async () => {
    const cache = new MarketDataCache(1_000);
    const load = vi.fn(async () => ({
      ok: true as const,
      data: "cached value",
    }));

    await expect(cache.getOrSet("quote:AAPL", load)).resolves.toEqual({ ok: true, data: "cached value" });
    await expect(cache.getOrSet("quote:AAPL", load)).resolves.toEqual({ ok: true, data: "cached value" });

    expect(load).toHaveBeenCalledTimes(1);
  });

  it("does not cache provider errors", async () => {
    const cache = new MarketDataCache(1_000);
    const load = vi.fn(async () => ({
      ok: false as const,
      error: {
        code: "provider_unavailable" as const,
        message: "Provider failed",
        provider: "finnhub" as const,
      },
    }));

    await cache.getOrSet("quote:AAPL", load);
    await cache.getOrSet("quote:AAPL", load);

    expect(load).toHaveBeenCalledTimes(2);
  });
});
