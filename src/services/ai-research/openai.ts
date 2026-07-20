import type { ResearchAnalysis, ResearchAnalysisResult, ResearchContext } from "@/domain/ai-research";

const schema = {
  type: "object",
  additionalProperties: false,
  required: ["companySummary", "valuationOverview", "bullCase", "bearCase", "keyRisks", "catalysts", "assumptions", "facts", "estimates", "aiInterpretation", "sourcesUsed", "evidenceQuality"],
  properties: {
    companySummary: { type: "string" }, valuationOverview: { type: "string" },
    bullCase: { type: "array", items: { type: "string" } }, bearCase: { type: "array", items: { type: "string" } },
    keyRisks: { type: "array", items: { type: "string" } }, catalysts: { type: "array", items: { type: "string" } },
    assumptions: { type: "array", items: { type: "string" } }, facts: { type: "array", items: { type: "string" } },
    estimates: { type: "array", items: { type: "string" } }, aiInterpretation: { type: "array", items: { type: "string" } },
    sourcesUsed: { type: "array", items: { type: "string" } },
    evidenceQuality: { type: "string", enum: ["low", "medium", "high"] },
  },
} as const;

function extractText(response: unknown) {
  if (!response || typeof response !== "object" || !("output" in response) || !Array.isArray(response.output)) return undefined;
  for (const item of response.output) {
    if (!item || typeof item !== "object" || !("content" in item) || !Array.isArray(item.content)) continue;
    for (const content of item.content) {
      if (content && typeof content === "object" && "type" in content && content.type === "output_text" && "text" in content && typeof content.text === "string") return content.text;
    }
  }
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isAnalysis(value: unknown): value is Omit<ResearchAnalysis, "generatedAt" | "marketDataTimestamp" | "model"> {
  if (!value || typeof value !== "object") return false;
  const analysis = value as Record<string, unknown>;
  return typeof analysis.companySummary === "string"
    && typeof analysis.valuationOverview === "string"
    && ["bullCase", "bearCase", "keyRisks", "catalysts", "assumptions", "facts", "estimates", "aiInterpretation", "sourcesUsed"].every((key) => isStringArray(analysis[key]))
    && ["low", "medium", "high"].includes(String(analysis.evidenceQuality));
}

export async function generateOpenAIResearch(context: ResearchContext): Promise<ResearchAnalysisResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL ?? "gpt-5.6-luna";
  if (!apiKey) return { ok: false, code: "missing_api_key", message: "AI research is not configured. Set OPENAI_API_KEY on the server." };

  const marketDataTimestamp = context.sources.map((source) => source.dataTimestamp).sort().at(-1) ?? new Date().toISOString();
  let response: Response;
  try {
    response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        reasoning: { effort: "low" },
        instructions: "Create neutral investment research, never personalized advice. Use only supplied data. Separate facts, estimates, and interpretation. State uncertainty and do not invent sources or figures.",
        input: JSON.stringify(context),
        text: { format: { type: "json_schema", name: "investment_research", strict: true, schema } },
      }),
      cache: "no-store",
    });
  } catch {
    return { ok: false, code: "provider_error", message: "AI provider is temporarily unavailable." };
  }

  if (!response.ok) return { ok: false, code: "provider_error", message: `AI provider request failed with status ${response.status}.` };
  const text = extractText(await response.json());
  if (!text) return { ok: false, code: "invalid_response", message: "AI provider returned no structured analysis." };
  try {
    const parsed: unknown = JSON.parse(text);
    if (!isAnalysis(parsed)) return { ok: false, code: "invalid_response", message: "AI provider returned incomplete structured analysis." };
    return { ok: true, data: { ...parsed, generatedAt: new Date().toISOString(), marketDataTimestamp, model } };
  } catch {
    return { ok: false, code: "invalid_response", message: "AI provider returned invalid structured analysis." };
  }
}
