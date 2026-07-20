import { PublicDisclosureLayout } from "@/features/legal/components/public-disclosure-layout";

export default function AiLimitationsPage() {
  return (
    <PublicDisclosureLayout title="AI Limitations">
      <h2>Known limitations</h2>
      <p>
        AI output can contain hallucinations, factual errors, stale context, missing context, bias, and inconsistent responses.
        Small prompt changes can materially change an answer. AI-generated output may omit important risks, assumptions, or
        source limitations.
      </p>
      <h2>No suitability assessment</h2>
      <p>
        AI Investor Assistant cannot assess personal circumstances, objectives, risk tolerance, tax position, liquidity needs,
        legal restrictions, or suitability. AI output must never be presented or interpreted as a buy, sell, hold, or trade
        instruction.
      </p>
      <h2>No guarantees</h2>
      <p>
        The project does not guarantee citations, forecasts, target prices, risk estimates, completeness, or accuracy. Live
        market data may come from Finnhub when configured, while other areas may still contain clearly labelled demo or sample
        data.
      </p>
      <h2>Human review required</h2>
      <p>
        Users must verify AI output, market data, calculations, and source materials before making decisions. Human review is
        required before any investment, tax, legal, or operational action.
      </p>
    </PublicDisclosureLayout>
  );
}
