import type {
  CompanyProfile,
  MarketDataError,
  MarketDataResult,
  MarketDataSource,
  StockQuote,
} from "@/domain/market-data";
import { EtfResearchEmptyState, EtfResearchErrorCard } from "@/features/etfs/components/etf-research-states";
import { formatCurrency, formatDateTime, getFreshnessLabel } from "@/features/stocks/lib/format";

interface EtfResearchPageProps {
  symbol: string;
  quoteResult: MarketDataResult<StockQuote>;
  profileResult: MarketDataResult<CompanyProfile>;
}

const unavailable = "Unavailable from the configured provider";

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-zinc-800 py-3 last:border-b-0">
      <dt className="text-sm text-zinc-400">{label}</dt>
      <dd className="max-w-[62%] text-right text-sm font-medium text-zinc-100">{value || unavailable}</dd>
    </div>
  );
}

function MissingDataset({ description }: { description: string }) {
  return (
    <div className="rounded-lg border border-dashed border-zinc-700 bg-zinc-950/50 p-4">
      <p className="text-sm font-medium text-zinc-200">{unavailable}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
    </div>
  );
}

function DataNotice({ sources }: { sources: MarketDataSource[] }) {
  const fallback = sources.find((source) => source.isFallback);

  if (!fallback) {
    return null;
  }

  return (
    <div className="rounded-lg border border-amber-400/30 bg-amber-950/30 p-4 text-sm leading-6 text-amber-100">
      <p className="font-medium">Demo data notice</p>
      <p className="mt-1">{fallback.label}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-5">
      <h2 className="text-base font-semibold text-zinc-100">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function EtfResearchPage({ symbol, quoteResult, profileResult }: EtfResearchPageProps) {
  const quote = quoteResult.ok ? quoteResult.data : undefined;
  const profile = profileResult.ok ? profileResult.data : undefined;
  const errors = [quoteResult, profileResult].flatMap((result) => (result.ok ? [] : [result.error]));
  const sources = [quote?.source, profile?.source].filter((source): source is MarketDataSource => Boolean(source));
  const primarySource = quote?.source ?? profile?.source;

  if (!quote && !profile) {
    return (
      <div className="space-y-6">
        <EtfResearchEmptyState symbol={symbol} />
        <EtfResearchErrorCard errors={errors as MarketDataError[]} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DataNotice sources={sources} />
      <EtfResearchErrorCard errors={errors} />

      <section className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase text-zinc-500">{profile?.exchange ?? "Exchange unavailable"}</p>
            <h1 className="mt-2 text-3xl font-semibold text-zinc-100">{profile?.name ?? symbol}</h1>
            <p className="mt-2 text-sm text-zinc-400">ETF symbol: {symbol}</p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4 lg:min-w-64">
            <p className="text-sm text-zinc-400">Current market price</p>
            <p className="mt-2 text-3xl font-semibold text-zinc-100">
              {formatCurrency(quote?.currentPrice, profile?.currency ?? "USD")}
            </p>
          </div>
        </div>
        <dl className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-lg bg-zinc-950/70 p-4">
            <dt className="text-xs uppercase text-zinc-500">Source</dt>
            <dd className="mt-2 text-sm font-medium text-zinc-100">{primarySource?.label ?? "Unavailable"}</dd>
          </div>
          <div className="rounded-lg bg-zinc-950/70 p-4">
            <dt className="text-xs uppercase text-zinc-500">Data timestamp</dt>
            <dd className="mt-2 text-sm font-medium text-zinc-100">{formatDateTime(primarySource?.dataTimestamp)}</dd>
          </div>
          <div className="rounded-lg bg-zinc-950/70 p-4">
            <dt className="text-xs uppercase text-zinc-500">Freshness</dt>
            <dd className="mt-2 text-sm font-medium text-zinc-100">{getFreshnessLabel(primarySource)}</dd>
          </div>
        </dl>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <Section title="Fund overview">
          <dl>
            <DetailRow label="Fund name" value={profile?.name} />
            <DetailRow label="Expense ratio" />
            <DetailRow label="Assets under management (AUM)" />
            <DetailRow label="Distribution policy" />
            <DetailRow label="Replication method" />
          </dl>
        </Section>

        <Section title="Top holdings">
          <MissingDataset description="Finnhub does not provide ETF holdings through the configured endpoints. No holdings have been inferred or fabricated." />
        </Section>

        <Section title="Country exposure">
          <MissingDataset description="Country allocation data requires a dedicated fund-data source and is not available from the current provider." />
        </Section>

        <Section title="Sector exposure">
          <MissingDataset description="Sector allocation data requires a dedicated fund-data source and is not available from the current provider." />
        </Section>

        <Section title="Main risks">
          <MissingDataset description="Fund-specific risk analysis is unavailable without holdings, strategy, replication, and issuer documentation. This page does not generate personalized investment advice." />
        </Section>

        <Section title="Alternatives">
          <MissingDataset description="Comparable funds are unavailable from the configured provider. Alternatives are not ranked or recommended without comparable fund data." />
        </Section>
      </div>

      <Section title="Sources">
        <div className="grid gap-3 md:grid-cols-2">
          {sources.map((source, index) => (
            <div key={`${source.provider}-${source.dataTimestamp}-${index}`} className="rounded-lg bg-zinc-950/70 p-4">
              <p className="text-sm font-medium text-zinc-100">{source.label}</p>
              <p className="mt-2 text-sm text-zinc-400">Provider: {source.provider}</p>
              <p className="mt-1 text-sm text-zinc-400">Timestamp: {formatDateTime(source.dataTimestamp)}</p>
              <p className="mt-1 text-sm text-zinc-400">{getFreshnessLabel(source)}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
