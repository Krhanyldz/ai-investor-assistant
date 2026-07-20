import type { ResearchAnalysis, ResearchAnalysisResult } from "@/domain/ai-research";
import { AIDisclaimer } from "@/features/consent/components/ai-disclaimer";
import { formatDateTime } from "@/features/stocks/lib/format";

function List({ items }: { items: string[] }) {
  return items.length ? <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-300">{items.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="text-sm text-zinc-400">No supported points returned.</p>;
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-5"><h2 className="text-base font-semibold text-zinc-100">{title}</h2><div className="mt-3">{children}</div></section>;
}

export function ResearchAnalysisView({ result }: { result: ResearchAnalysisResult }) {
  if (!result.ok) return <div className="rounded-lg border border-amber-400/30 bg-amber-950/30 p-5 text-sm leading-6 text-amber-100" role="status">{result.message}</div>;
  const data: ResearchAnalysis = result.data;
  return <div className="space-y-6">
    <div className="rounded-lg border border-sky-400/30 bg-sky-950/30 p-4 text-sm text-sky-100">Evidence quality: <strong>{data.evidenceQuality}</strong> · Generated {formatDateTime(data.generatedAt)} · Market data {formatDateTime(data.marketDataTimestamp)} · Model {data.model}</div>
    <div className="grid gap-6 xl:grid-cols-2">
      <Card title="Company summary"><p className="text-sm leading-6 text-zinc-300">{data.companySummary}</p></Card>
      <Card title="Valuation overview"><p className="text-sm leading-6 text-zinc-300">{data.valuationOverview}</p></Card>
      <Card title="Bull case"><List items={data.bullCase} /></Card><Card title="Bear case"><List items={data.bearCase} /></Card>
      <Card title="Key risks"><List items={data.keyRisks} /></Card><Card title="Catalysts"><List items={data.catalysts} /></Card>
      <Card title="Assumptions"><List items={data.assumptions} /></Card><Card title="Sources used"><List items={data.sourcesUsed} /></Card>
      <Card title="Facts"><List items={data.facts} /></Card><Card title="Estimates"><List items={data.estimates} /></Card>
    </div>
    <Card title="AI interpretation"><List items={data.aiInterpretation} /></Card>
    <AIDisclaimer />
  </div>;
}
