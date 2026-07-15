import { afterEach, describe, expect, it, vi } from "vitest";
import { FinnhubMarketDataProvider } from "@/services/market-data/providers/finnhub/provider";

describe("FinnhubMarketDataProvider", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("parses stock quotes into provider-neutral data", async () => {
    vi.stubEnv("FINNHUB_API_KEY", "server-secret");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({
          c: 188.42,
          d: 1.24,
          dp: 0.66,
          h: 190.1,
          l: 186.8,
          o: 187.05,
          pc: 187.18,
          t: 1_720_000_000,
        }),
      ),
    );

    const result = await new FinnhubMarketDataProvider().getQuote("aapl");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.symbol).toBe("AAPL");
      expect(result.data.currentPrice).toBe(188.42);
      expect(result.data.source.provider).toBe("finnhub");
      expect(result.data.source.isFallback).toBe(false);
      expect(result.data.source.dataTimestamp).toBe("2024-07-03T09:46:40.000Z");
    }
  });

  it("parses company profiles into provider-neutral data", async () => {
    vi.stubEnv("FINNHUB_API_KEY", "server-secret");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({
          country: "US",
          currency: "USD",
          exchange: "NASDAQ NMS - GLOBAL MARKET",
          finnhubIndustry: "Technology",
          ipo: "1980-12-12",
          marketCapitalization: 2_900_000,
          name: "Apple Inc",
          shareOutstanding: 15_000,
          ticker: "AAPL",
          weburl: "https://www.apple.com/",
        }),
      ),
    );

    const result = await new FinnhubMarketDataProvider().getCompanyProfile("AAPL");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.name).toBe("Apple Inc");
      expect(result.data.industry).toBe("Technology");
      expect(result.data.source.label).toBe("Finnhub");
    }
  });

  it("parses basic financial metrics into provider-neutral data", async () => {
    vi.stubEnv("FINNHUB_API_KEY", "server-secret");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({
          metric: {
            marketCapitalization: 2_900_000,
            peBasicExclExtraTTM: 29.5,
          },
          symbol: "AAPL",
        }),
      ),
    );

    const result = await new FinnhubMarketDataProvider().getBasicFinancials("AAPL");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.metric.marketCapitalization).toBe(2_900_000);
      expect(result.data.source.provider).toBe("finnhub");
    }
  });
});
