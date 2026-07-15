import { afterEach, describe, expect, it, vi } from "vitest";
import { getStockQuote, marketDataCache } from "@/services/market-data";

describe("market data service facade", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    marketDataCache.clear();
  });

  it("uses clearly labeled mock data only in development when Finnhub fails", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("FINNHUB_API_KEY", "");

    const result = await getStockQuote("AAPL");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.source.provider).toBe("development-mock");
      expect(result.data.source.isFallback).toBe(true);
      expect(result.data.source.label).toContain("Development mock data");
    }
  });

  it("returns the typed provider error outside development", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("FINNHUB_API_KEY", "");

    const result = await getStockQuote("AAPL");

    expect(result).toEqual({
      ok: false,
      error: {
        code: "missing_api_key",
        message: "FINNHUB_API_KEY is not configured.",
        provider: "finnhub",
      },
    });
  });
});
