import type { MarketDataError, MarketDataResult } from "@/domain/market-data";

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";

interface FetchFinnhubJsonOptions {
  endpoint: string;
  params: Record<string, string>;
  apiKey?: string;
}

function getRetryAfterSeconds(headers: Headers): number | undefined {
  const retryAfter = headers.get("retry-after");

  if (!retryAfter) {
    return undefined;
  }

  const parsed = Number(retryAfter);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function createProviderError(
  code: MarketDataError["code"],
  message: string,
  retryAfterSeconds?: number,
): MarketDataResult<never> {
  return {
    ok: false,
    error: {
      code,
      message,
      provider: "finnhub",
      retryAfterSeconds,
    },
  };
}

export async function fetchFinnhubJson<T>({
  endpoint,
  params,
  apiKey = process.env.FINNHUB_API_KEY,
}: FetchFinnhubJsonOptions): Promise<MarketDataResult<T>> {
  if (!apiKey) {
    return createProviderError("missing_api_key", "FINNHUB_API_KEY is not configured.");
  }

  const url = new URL(`${FINNHUB_BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  url.searchParams.set("token", apiKey);

  try {
    const response = await fetch(url);

    if (response.status === 429) {
      return createProviderError(
        "provider_rate_limited",
        "Finnhub rate limit exceeded.",
        getRetryAfterSeconds(response.headers),
      );
    }

    if (!response.ok) {
      return createProviderError("provider_unavailable", `Finnhub request failed with status ${response.status}.`);
    }

    return {
      ok: true,
      data: (await response.json()) as T,
    };
  } catch {
    return createProviderError("provider_unavailable", "Finnhub request failed before a response was received.");
  }
}
