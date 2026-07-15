import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchFinnhubJson } from "@/services/market-data/providers/finnhub/client";

describe("fetchFinnhubJson", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("keeps FINNHUB_API_KEY server-side and sends it only to Finnhub", async () => {
    vi.stubEnv("FINNHUB_API_KEY", "server-secret");
    const fetchMock = vi.fn(async () => Response.json({ c: 1 }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await fetchFinnhubJson<{ c: number }>({
      endpoint: "/quote",
      params: { symbol: "AAPL" },
    });

    expect(result).toEqual({ ok: true, data: { c: 1 } });
    const requestedUrl = new URL(String(fetchMock.mock.calls[0][0]));
    expect(requestedUrl.hostname).toBe("finnhub.io");
    expect(requestedUrl.searchParams.get("token")).toBe("server-secret");
  });

  it("returns a typed missing key error when FINNHUB_API_KEY is absent", async () => {
    vi.stubEnv("FINNHUB_API_KEY", "");

    const result = await fetchFinnhubJson({
      endpoint: "/quote",
      params: { symbol: "AAPL" },
    });

    expect(result).toEqual({
      ok: false,
      error: {
        code: "missing_api_key",
        message: "FINNHUB_API_KEY is not configured.",
        provider: "finnhub",
      },
    });
  });

  it("maps rate limits to a typed provider error", async () => {
    vi.stubEnv("FINNHUB_API_KEY", "server-secret");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("rate limited", { status: 429, headers: { "retry-after": "30" } })),
    );

    const result = await fetchFinnhubJson({
      endpoint: "/quote",
      params: { symbol: "AAPL" },
    });

    expect(result).toEqual({
      ok: false,
      error: {
        code: "provider_rate_limited",
        message: "Finnhub rate limit exceeded.",
        provider: "finnhub",
        retryAfterSeconds: 30,
      },
    });
  });
});
