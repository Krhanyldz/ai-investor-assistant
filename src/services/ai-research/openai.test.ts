import { afterEach, describe, expect, it, vi } from "vitest";
import { generateOpenAIResearch } from "@/services/ai-research/openai";

describe("OpenAI research provider", () => {
  afterEach(() => { vi.unstubAllGlobals(); delete process.env.OPENAI_API_KEY; });

  it("fails safely without a server key", async () => {
    expect(await generateOpenAIResearch({ symbol: "AAPL", sources: [] })).toMatchObject({ ok: false, code: "missing_api_key" });
  });

  it("parses schema-constrained response text", async () => {
    process.env.OPENAI_API_KEY = "test-key";
    const analysis = { companySummary: "Summary", valuationOverview: "Valuation", bullCase: [], bearCase: [], keyRisks: [], catalysts: [], assumptions: [], facts: [], estimates: [], aiInterpretation: [], sourcesUsed: ["Finnhub"], evidenceQuality: "medium" };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ output: [{ content: [{ type: "output_text", text: JSON.stringify(analysis) }] }] }) }));
    const result = await generateOpenAIResearch({ symbol: "AAPL", sources: [] });
    expect(result.ok && result.data.companySummary).toBe("Summary");
  });

  it("rejects incomplete structured output", async () => {
    process.env.OPENAI_API_KEY = "test-key";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ output: [{ content: [{ type: "output_text", text: JSON.stringify({ companySummary: "Incomplete" }) }] }] }) }));
    expect(await generateOpenAIResearch({ symbol: "AAPL", sources: [] })).toMatchObject({ ok: false, code: "invalid_response" });
  });

  it("handles provider connection failures without exposing details", async () => {
    process.env.OPENAI_API_KEY = "test-key";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("secret transport detail")));
    expect(await generateOpenAIResearch({ symbol: "AAPL", sources: [] })).toEqual({ ok: false, code: "provider_error", message: "AI provider is temporarily unavailable." });
  });
});
