import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import StockResearchRoute from "./page";

const getStockQuote = vi.fn();
const getCompanyProfile = vi.fn();
const getBasicFinancials = vi.fn();

vi.mock("@/services/market-data", () => ({
  getStockQuote: (symbol: string) => getStockQuote(symbol),
  getCompanyProfile: (symbol: string) => getCompanyProfile(symbol),
  getBasicFinancials: (symbol: string) => getBasicFinancials(symbol),
}));

vi.mock("@/features/dashboard/components/dashboard-layout", () => ({
  DashboardLayout: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section>
      <h1>{title}</h1>
      {children}
    </section>
  ),
}));

vi.mock("@/features/stocks/components/stock-research-page", () => ({
  StockResearchPage: ({ symbol }: { symbol: string }) => <div>Research page for {symbol}</div>,
}));

describe("StockResearchRoute", () => {
  beforeEach(() => {
    getStockQuote.mockReset();
    getCompanyProfile.mockReset();
    getBasicFinancials.mockReset();
    getStockQuote.mockResolvedValue({ ok: false, error: { code: "not_found", message: "No quote", provider: "finnhub" } });
    getCompanyProfile.mockResolvedValue({ ok: false, error: { code: "not_found", message: "No profile", provider: "finnhub" } });
    getBasicFinancials.mockResolvedValue({ ok: false, error: { code: "not_found", message: "No metrics", provider: "finnhub" } });
  });

  it("normalizes the symbol and requests each market data resource once", async () => {
    const page = await StockResearchRoute({ params: Promise.resolve({ symbol: "aapl" }) });

    render(page);

    expect(getStockQuote).toHaveBeenCalledTimes(1);
    expect(getCompanyProfile).toHaveBeenCalledTimes(1);
    expect(getBasicFinancials).toHaveBeenCalledTimes(1);
    expect(getStockQuote).toHaveBeenCalledWith("AAPL");
    expect(getCompanyProfile).toHaveBeenCalledWith("AAPL");
    expect(getBasicFinancials).toHaveBeenCalledWith("AAPL");
    expect(screen.getByText("Research page for AAPL")).toBeTruthy();
  });
});
