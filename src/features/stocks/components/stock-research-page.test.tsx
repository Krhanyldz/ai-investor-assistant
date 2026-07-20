import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type {
  BasicFinancialMetrics,
  CompanyProfile,
  MarketDataResult,
  StockQuote,
} from "@/domain/market-data";
import { StockResearchPage } from "@/features/stocks/components/stock-research-page";

const source = {
  provider: "finnhub" as const,
  retrievedAt: "2026-07-15T08:00:00.000Z",
  dataTimestamp: "2026-07-15T08:00:00.000Z",
  isFallback: false,
  label: "Finnhub",
};

const quote: StockQuote = {
  symbol: "AAPL",
  currentPrice: 188.42,
  change: 1.24,
  percentChange: 0.66,
  highPrice: 190.1,
  lowPrice: 186.8,
  openPrice: 187.05,
  previousClose: 187.18,
  source,
};

const profile: CompanyProfile = {
  symbol: "AAPL",
  name: "Apple Inc",
  exchange: "NASDAQ",
  currency: "USD",
  country: "US",
  industry: "Technology",
  ipo: "1980-12-12",
  marketCapitalization: 2_900_000,
  shareOutstanding: 15_000,
  webUrl: "https://www.apple.com/",
  source,
};

const financials: BasicFinancialMetrics = {
  symbol: "AAPL",
  metric: {
    peBasicExclExtraTTM: 29.5,
    revenueGrowthTTMYoy: 0.08,
  },
  source,
};

const providerError = {
  code: "provider_unavailable" as const,
  message: "Provider failed",
  provider: "finnhub" as const,
};

describe("StockResearchPage", () => {
  it("renders the full stock research page with source and placeholder sections", () => {
    render(
      <StockResearchPage
        symbol="AAPL"
        quoteResult={{ ok: true, data: quote }}
        profileResult={{ ok: true, data: profile }}
        financialsResult={{ ok: true, data: financials }}
      />,
    );

    expect(screen.getByRole("heading", { level: 1, name: "Apple Inc" })).toBeTruthy();
    expect(screen.getByText("Symbol: AAPL")).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Company Overview" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Valuation" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Sources" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Open structured AI research" }).getAttribute("href")).toBe("/ai-research/AAPL");
    expect(screen.getByRole("link", { name: "Generate source-bound risk research" })).toBeTruthy();
  });

  it("renders available data when one provider call fails", () => {
    render(
      <StockResearchPage
        symbol="AAPL"
        quoteResult={{ ok: true, data: quote }}
        profileResult={{ ok: false, error: providerError }}
        financialsResult={{ ok: true, data: financials }}
      />,
    );

    expect(screen.getByRole("heading", { level: 2, name: "Some market data is unavailable" })).toBeTruthy();
    expect(screen.getByText(/Provider failed/)).toBeTruthy();
    expect(screen.getByRole("heading", { level: 1, name: "AAPL" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Valuation" })).toBeTruthy();
  });

  it("renders an empty state when all provider calls fail", () => {
    const failedResult: MarketDataResult<StockQuote> = { ok: false, error: providerError };

    render(
      <StockResearchPage
        symbol="AAPL"
        quoteResult={failedResult}
        profileResult={{ ok: false, error: providerError }}
        financialsResult={{ ok: false, error: providerError }}
      />,
    );

    expect(screen.getByRole("heading", { level: 2, name: "No market data available for AAPL" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Provider errors" })).toBeTruthy();
  });

  it("clearly labels development fallback data as demo data", () => {
    render(
      <StockResearchPage
        symbol="AAPL"
        quoteResult={{
          ok: true,
          data: {
            ...quote,
            source: {
              ...source,
              provider: "development-mock",
              isFallback: true,
              label: "Development mock data for AAPL. Not live market data.",
            },
          },
        }}
        profileResult={{ ok: true, data: profile }}
        financialsResult={{ ok: true, data: financials }}
      />,
    );

    expect(screen.getByText("Demo data notice")).toBeTruthy();
    expect(screen.getAllByText("Development mock data for AAPL. Not live market data.").length).toBeGreaterThan(0);
  });
});
