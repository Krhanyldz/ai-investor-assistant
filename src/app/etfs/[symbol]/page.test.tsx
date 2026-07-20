import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EtfResearchRoute from "./page";

const getStockQuote = vi.fn();
const getCompanyProfile = vi.fn();

vi.mock("@/services/market-data", () => ({
  getStockQuote: (symbol: string) => getStockQuote(symbol),
  getCompanyProfile: (symbol: string) => getCompanyProfile(symbol),
}));

vi.mock("@/features/dashboard/components/dashboard-layout", () => ({
  DashboardLayout: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section><h1>{title}</h1>{children}</section>
  ),
}));

vi.mock("@/features/etfs/components/etf-research-page", () => ({
  EtfResearchPage: ({ symbol }: { symbol: string }) => <div>ETF research for {symbol}</div>,
}));

describe("EtfResearchRoute", () => {
  beforeEach(() => {
    getStockQuote.mockReset();
    getCompanyProfile.mockReset();
    getStockQuote.mockResolvedValue({ ok: false, error: { code: "not_found", message: "No quote", provider: "finnhub" } });
    getCompanyProfile.mockResolvedValue({ ok: false, error: { code: "not_found", message: "No profile", provider: "finnhub" } });
  });

  it("normalizes dynamic ETF symbols and loads provider data", async () => {
    const page = await EtfResearchRoute({ params: Promise.resolve({ symbol: "vti" }) });
    render(page);

    expect(getStockQuote).toHaveBeenCalledWith("VTI");
    expect(getCompanyProfile).toHaveBeenCalledWith("VTI");
    expect(screen.getByText("ETF research for VTI")).toBeTruthy();
  });
});
