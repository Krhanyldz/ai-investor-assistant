import Link from "next/link";
import type { ReactNode } from "react";
import type {
  BasicFinancialMetrics,
  CompanyProfile,
  MarketDataError,
  MarketDataResult,
  MarketDataSource,
  StockQuote,
} from "@/domain/market-data";
import {
  formatCompactNumber,
  formatCurrency,
  formatDateTime,
  formatMetricValue,
  formatPercent,
  getFreshnessLabel,
} from "@/features/stocks/lib/format";
import { StockResearchEmptyState, StockResearchErrorCard } from "@/features/stocks/components/stock-research-states";

interface StockResearchPageProps {
  symbol: string;
  quoteResult: MarketDataResult<StockQuote>;
  profileResult: MarketDataResult<CompanyProfile>;
  financialsResult: MarketDataResult<BasicFinancialMetrics>;
}

interface DetailRowProps {
  label: string;
  value: string;
}

function getData<T>(result: MarketDataResult<T>) {
  return result.ok ? result.data : undefined;
}

function getErrors(...results: MarketDataResult<unknown>[]) {
  return results.flatMap((result) => (result.ok ? [] : [result.error]));
}

function getPrimarySource(
  quote?: StockQuote,
  profile?: CompanyProfile,
  financials?: BasicFinancialMetrics,
): MarketDataSource | undefined {
  return quote?.source ?? profile?.source ?? financials?.source;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-zinc-800 py-3 last:border-b-0">
      <dt className="text-sm text-zinc-400">{label}</dt>
      <dd className="max-w-[60%] text-right text-sm font-medium text-zinc-100">{value}</dd>
    </div>
  );
}

function PlaceholderSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-5">
      <h2 className="text-base font-semibold text-zinc-100">{title}</h2>
      <div className="mt-3 text-sm leading-6 text-zinc-400">{children}</div>
    </section>
  );
}

function DemoDataNotice({ sources }: { sources: MarketDataSource[] }) {
  const fallbackSource = sources.find((source) => source.isFallback);

  if (!fallbackSource) {
    return null;
  }

  return (
    <div className="rounded-lg border border-amber-400/30 bg-amber-950/30 p-4 text-sm leading-6 text-amber-100">
      <p className="font-medium">Demo data notice</p>
      <p className="mt-1">{fallbackSource.label}</p>
    </div>
  );
}

function ResearchHeader({
  symbol,
  quote,
  profile,
  source,
}: {
  symbol: string;
  quote?: StockQuote;
  profile?: CompanyProfile;
  source?: MarketDataSource;
}) {
  const currency = profile?.currency ?? "USD";
  const changeIsPositive = (quote?.change ?? 0) >= 0;

  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase text-zinc-500">{profile?.exchange ?? "Exchange unavailable"}</p>
          <h1 className="mt-2 text-3xl font-semibold text-zinc-100">{profile?.name ?? symbol}</h1>
          <p className="mt-2 text-sm text-zinc-400">Symbol: {symbol}</p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4 lg:min-w-64">
          <p className="text-sm text-zinc-400">Current price</p>
          <p className="mt-2 text-3xl font-semibold text-zinc-100">{formatCurrency(quote?.currentPrice, currency)}</p>
          <p className={`mt-2 text-sm font-medium ${changeIsPositive ? "text-emerald-300" : "text-rose-300"}`}>
            {quote ? `${formatCurrency(quote.change, currency)} (${formatPercent(quote.percentChange)})` : "Unavailable"}
          </p>
        </div>
      </div>

      <dl className="mt-6 grid gap-3 md:grid-cols-3">
        <div className="rounded-lg bg-zinc-950/70 p-4">
          <dt className="text-xs uppercase text-zinc-500">Source</dt>
          <dd className="mt-2 text-sm font-medium text-zinc-100">{source?.label ?? "Unavailable"}</dd>
        </div>
        <div className="rounded-lg bg-zinc-950/70 p-4">
          <dt className="text-xs uppercase text-zinc-500">Last updated</dt>
          <dd className="mt-2 text-sm font-medium text-zinc-100">{formatDateTime(source?.dataTimestamp)}</dd>
        </div>
        <div className="rounded-lg bg-zinc-950/70 p-4">
          <dt className="text-xs uppercase text-zinc-500">Data freshness</dt>
          <dd className="mt-2 text-sm font-medium text-zinc-100">{getFreshnessLabel(source)}</dd>
        </div>
      </dl>
    </section>
  );
}

function CompanyOverview({ profile }: { profile?: CompanyProfile }) {
  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-5">
      <h2 className="text-base font-semibold text-zinc-100">Company Overview</h2>
      <dl className="mt-4">
        <DetailRow label="Industry" value={profile?.industry ?? "Unavailable"} />
        <DetailRow label="Country" value={profile?.country ?? "Unavailable"} />
        <DetailRow label="IPO" value={profile?.ipo ?? "Unavailable"} />
        <DetailRow label="Website" value={profile?.webUrl ?? "Unavailable"} />
        <DetailRow label="Market Cap" value={formatCompactNumber(profile?.marketCapitalization)} />
      </dl>
    </section>
  );
}

function ValuationSection({
  profile,
  financials,
}: {
  profile?: CompanyProfile;
  financials?: BasicFinancialMetrics;
}) {
  const metric = financials?.metric ?? {};
  const metricRows = [
    ["P/E", metric.peBasicExclExtraTTM ?? metric.peNormalizedAnnual],
    ["Revenue Growth TTM YoY", metric.revenueGrowthTTMYoy],
    ["Gross Margin TTM", metric.grossMarginTTM],
    ["Operating Margin TTM", metric.operatingMarginTTM],
  ] as const;

  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-5">
      <h2 className="text-base font-semibold text-zinc-100">Valuation</h2>
      <dl className="mt-4">
        <DetailRow label="P/E" value={formatMetricValue(metric.peBasicExclExtraTTM ?? metric.peNormalizedAnnual)} />
        <DetailRow label="Market Cap" value={formatCompactNumber(profile?.marketCapitalization)} />
        <DetailRow label="Shares Outstanding" value={formatCompactNumber(profile?.shareOutstanding)} />
      </dl>

      <h3 className="mt-5 text-sm font-semibold text-zinc-200">Basic financial metrics</h3>
      <dl className="mt-2">
        {metricRows.map(([label, value]) => (
          <DetailRow key={label} label={label} value={formatMetricValue(value)} />
        ))}
      </dl>
    </section>
  );
}

function SourcesSection({ sources }: { sources: MarketDataSource[] }) {
  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-5">
      <h2 className="text-base font-semibold text-zinc-100">Sources</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {sources.map((source, index) => (
          <div key={`${source.provider}-${source.dataTimestamp}-${index}`} className="rounded-lg bg-zinc-950/70 p-4">
            <p className="text-sm font-medium text-zinc-100">{source.label}</p>
            <p className="mt-2 text-sm text-zinc-400">Provider: {source.provider}</p>
            <p className="mt-1 text-sm text-zinc-400">Timestamp: {formatDateTime(source.dataTimestamp)}</p>
            <p className="mt-1 text-sm text-zinc-400">{getFreshnessLabel(source)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function StockResearchPage({
  symbol,
  quoteResult,
  profileResult,
  financialsResult,
}: StockResearchPageProps) {
  const quote = getData(quoteResult);
  const profile = getData(profileResult);
  const financials = getData(financialsResult);
  const errors = getErrors(quoteResult, profileResult, financialsResult);
  const sources = [quote?.source, profile?.source, financials?.source].filter((source): source is MarketDataSource =>
    Boolean(source),
  );
  const primarySource = getPrimarySource(quote, profile, financials);

  if (!quote && !profile && !financials) {
    return (
      <div className="space-y-6">
        <StockResearchEmptyState symbol={symbol} />
        <StockResearchErrorCard title="Provider errors" errors={errors as MarketDataError[]} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DemoDataNotice sources={sources} />
      {errors.length > 0 ? <StockResearchErrorCard title="Some market data is unavailable" errors={errors} /> : null}
      <ResearchHeader symbol={symbol} quote={quote} profile={profile} source={primarySource} />
      <div className="grid gap-6 xl:grid-cols-2">
        <CompanyOverview profile={profile} />
        <ValuationSection profile={profile} financials={financials} />
        <PlaceholderSection title="Business Summary">A narrative summary is unavailable from the configured market-data provider. No description has been fabricated.</PlaceholderSection>
        <PlaceholderSection title="Risk Factors"><Link href={`/ai-research/${encodeURIComponent(symbol)}?question=${encodeURIComponent("Explain the key business and valuation risks")}`} className="text-emerald-300 underline">Generate source-bound risk research</Link> with the AI research workspace.</PlaceholderSection>
      </div>
      <PlaceholderSection title="AI Summary"><Link href={`/ai-research/${encodeURIComponent(symbol)}`} className="text-emerald-300 underline">Open structured AI research</Link> for bull and bear cases, assumptions, catalysts, risks, and evidence quality.</PlaceholderSection>
      {sources.length > 0 ? <SourcesSection sources={sources} /> : null}
    </div>
  );
}
