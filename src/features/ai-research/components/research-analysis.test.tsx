import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { personalizedAdviceRefusal, type ResearchAnalysisResult } from "@/domain/ai-research";
import { ResearchAnalysisView } from "@/features/ai-research/components/research-analysis";

const result: ResearchAnalysisResult = {
  ok: true,
  data: {
    companySummary: "Company summary", valuationOverview: "Valuation overview",
    bullCase: ["Bull"], bearCase: ["Bear"], keyRisks: ["Risk"], catalysts: ["Catalyst"],
    assumptions: ["Assumption"], facts: ["Fact"], estimates: ["Estimate"], aiInterpretation: ["Interpretation"],
    sourcesUsed: ["Finnhub"], evidenceQuality: "medium", generatedAt: "2026-07-20T12:00:00.000Z",
    marketDataTimestamp: "2026-07-20T11:59:00.000Z", model: "test-model",
  },
};

describe("ResearchAnalysisView", () => {
  it("renders the required evidence sections and persistent disclaimer", () => {
    render(<ResearchAnalysisView result={result} />);
    for (const heading of ["Company summary", "Valuation overview", "Bull case", "Bear case", "Key risks", "Catalysts", "Assumptions", "Sources used", "Facts", "Estimates", "AI interpretation"]) {
      expect(screen.getByRole("heading", { name: heading })).toBeTruthy();
    }
    expect(screen.getByText(/AI-generated output may be inaccurate, incomplete, or outdated/i)).toBeTruthy();
    expect(screen.getByText(/Evidence quality:/)).toBeTruthy();
  });

  it("shows the exact refusal safely", () => {
    render(<ResearchAnalysisView result={{ ok: false, code: "refused", message: personalizedAdviceRefusal }} />);
    expect(screen.getByRole("status").textContent).toBe(personalizedAdviceRefusal);
  });
});
