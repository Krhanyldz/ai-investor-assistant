import { beforeEach, describe, expect, it, vi } from "vitest";
import { personalizedAdviceRefusal } from "@/domain/ai-research";
import { generateResearchAnalysis, isPersonalizedAdviceRequest } from "@/services/ai-research";

const generateOpenAIResearch = vi.fn();
vi.mock("@/services/ai-research/openai", () => ({ generateOpenAIResearch: (context: unknown) => generateOpenAIResearch(context) }));

const context = { symbol: "AAPL", sources: [] };

describe("AI research guardrails", () => {
  beforeEach(() => generateOpenAIResearch.mockReset());

  it("detects personalized recommendations", () => {
    expect(isPersonalizedAdviceRequest("Should I buy AAPL with 20% of my portfolio?")).toBe(true);
    expect(isPersonalizedAdviceRequest("Explain AAPL revenue risks")).toBe(false);
  });

  it("refuses advice before calling the model", async () => {
    const result = await generateResearchAnalysis({ ...context, question: "Should I buy this?" });
    expect(result).toEqual({ ok: false, code: "refused", message: personalizedAdviceRefusal });
    expect(generateOpenAIResearch).not.toHaveBeenCalled();
  });

  it("delegates neutral research", async () => {
    generateOpenAIResearch.mockResolvedValue({ ok: false, code: "missing_api_key", message: "missing" });
    await generateResearchAnalysis({ ...context, question: "Explain valuation risks" });
    expect(generateOpenAIResearch).toHaveBeenCalledTimes(1);
  });
});
