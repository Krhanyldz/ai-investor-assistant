import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AiResearchSymbolPage from "./page";
import { personalizedAdviceRefusal } from "@/domain/ai-research";

const getStockQuote = vi.fn();
const getCompanyProfile = vi.fn();
const getBasicFinancials = vi.fn();
const generateResearchAnalysis = vi.fn();

vi.mock("@/services/market-data", () => ({
  getStockQuote: (symbol: string) => getStockQuote(symbol),
  getCompanyProfile: (symbol: string) => getCompanyProfile(symbol),
  getBasicFinancials: (symbol: string) => getBasicFinancials(symbol),
}));

vi.mock("@/services/ai-research", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/services/ai-research")>();
  return {
    ...actual,
    generateResearchAnalysis: (context: unknown) => generateResearchAnalysis(context),
  };
});

vi.mock("@/features/dashboard/components/dashboard-layout", () => ({
  DashboardLayout: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section>
      <h1>{title}</h1>
      {children}
    </section>
  ),
}));

describe("AiResearchSymbolPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getStockQuote.mockResolvedValue({ ok: false, error: { code: "not_found", message: "No quote", provider: "finnhub" } });
    getCompanyProfile.mockResolvedValue({ ok: false, error: { code: "not_found", message: "No profile", provider: "finnhub" } });
    getBasicFinancials.mockResolvedValue({ ok: false, error: { code: "not_found", message: "No metrics", provider: "finnhub" } });
    generateResearchAnalysis.mockResolvedValue({ ok: false, code: "missing_api_key", message: "AI research is not configured." });
  });

  it("normalizes the symbol and loads market context for research generation", async () => {
    const page = await AiResearchSymbolPage({
      params: Promise.resolve({ symbol: " aapl " }),
      searchParams: Promise.resolve({ question: "What are the key valuation risks?" }),
    });

    render(page);

    expect(getStockQuote).toHaveBeenCalledWith("AAPL");
    expect(getCompanyProfile).toHaveBeenCalledWith("AAPL");
    expect(getBasicFinancials).toHaveBeenCalledWith("AAPL");
    expect(generateResearchAnalysis).toHaveBeenCalledWith(
      expect.objectContaining({ symbol: "AAPL", question: "What are the key valuation risks?" }),
    );
    expect(screen.getByRole("heading", { level: 1, name: "AAPL AI Research" })).toBeTruthy();
  });

  it("short-circuits market-data fetches when personalized advice is requested", async () => {
    generateResearchAnalysis.mockResolvedValue({
      ok: false,
      code: "refused",
      message: personalizedAdviceRefusal,
    });

    const page = await AiResearchSymbolPage({
      params: Promise.resolve({ symbol: "msft" }),
      searchParams: Promise.resolve({ question: "Should I buy MSFT?" }),
    });

    render(page);

    expect(getStockQuote).not.toHaveBeenCalled();
    expect(getCompanyProfile).not.toHaveBeenCalled();
    expect(getBasicFinancials).not.toHaveBeenCalled();
    expect(screen.getByRole("status").textContent).toBe(personalizedAdviceRefusal);
  });
});
