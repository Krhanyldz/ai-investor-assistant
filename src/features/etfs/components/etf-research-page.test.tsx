import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { CompanyProfile, StockQuote } from "@/domain/market-data";
import { EtfResearchPage } from "@/features/etfs/components/etf-research-page";

const source = {
  provider: "finnhub" as const,
  retrievedAt: "2026-07-20T12:00:00.000Z",
  dataTimestamp: "2026-07-20T12:00:00.000Z",
  isFallback: false,
  label: "Finnhub",
};

const quote: StockQuote = {
  symbol: "VTI", currentPrice: 310, change: 1, percentChange: 0.32,
  highPrice: 311, lowPrice: 308, openPrice: 309, previousClose: 309, source,
};

const profile: CompanyProfile = {
  symbol: "VTI", name: "Vanguard Total Stock Market ETF", exchange: "NYSE Arca",
  currency: "USD", country: "US", source,
};

const providerError = {
  code: "provider_unavailable" as const,
  message: "Provider failed",
  provider: "finnhub" as const,
};

describe("EtfResearchPage", () => {
  it("renders every required research section and labels unavailable datasets", () => {
    render(<EtfResearchPage symbol="VTI" quoteResult={{ ok: true, data: quote }} profileResult={{ ok: true, data: profile }} />);

    expect(screen.getByRole("heading", { level: 1, name: profile.name })).toBeTruthy();
    for (const heading of ["Fund overview", "Top holdings", "Country exposure", "Sector exposure", "Main risks", "Alternatives", "Sources"]) {
      expect(screen.getByRole("heading", { level: 2, name: heading })).toBeTruthy();
    }
    expect(screen.getAllByText("Unavailable from the configured provider").length).toBeGreaterThan(3);
    expect(screen.getByText("Expense ratio")).toBeTruthy();
    expect(screen.getByText("Assets under management (AUM)")).toBeTruthy();
    expect(screen.getByText("Distribution policy")).toBeTruthy();
    expect(screen.getByText("Replication method")).toBeTruthy();
  });

  it("keeps partial data visible when one provider call fails", () => {
    render(<EtfResearchPage symbol="VTI" quoteResult={{ ok: true, data: quote }} profileResult={{ ok: false, error: providerError }} />);

    expect(screen.getByRole("heading", { level: 2, name: "Some ETF data is unavailable" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 1, name: "VTI" })).toBeTruthy();
  });

  it("renders a clear empty state when all provider calls fail", () => {
    render(<EtfResearchPage symbol="VTI" quoteResult={{ ok: false, error: providerError }} profileResult={{ ok: false, error: providerError }} />);

    expect(screen.getByRole("heading", { level: 2, name: "No ETF data available for VTI" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Some ETF data is unavailable" })).toBeTruthy();
  });
});
