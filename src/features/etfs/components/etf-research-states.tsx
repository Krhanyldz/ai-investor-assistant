import type { MarketDataError } from "@/domain/market-data";

export function EtfResearchErrorCard({ errors }: { errors: MarketDataError[] }) {
  if (errors.length === 0) {
    return null;
  }

  return (
    <section
      className="rounded-lg border border-rose-400/30 bg-rose-950/30 p-5 text-rose-100"
      aria-labelledby="etf-research-error-heading"
    >
      <h2 id="etf-research-error-heading" className="text-base font-semibold">
        Some ETF data is unavailable
      </h2>
      <div className="mt-3 space-y-2 text-sm leading-6 text-rose-100/80">
        {errors.map((error, index) => (
          <p key={`${error.provider}-${error.code}-${index}`}>
            <span className="font-medium">{error.provider}</span>: {error.message} ({error.code})
          </p>
        ))}
      </div>
    </section>
  );
}

export function EtfResearchEmptyState({ symbol }: { symbol: string }) {
  return (
    <section
      className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-8 text-center"
      aria-labelledby="etf-empty-state-heading"
    >
      <p className="text-sm font-medium uppercase text-zinc-500">Empty state</p>
      <h2 id="etf-empty-state-heading" className="mt-3 text-xl font-semibold text-zinc-100">
        No ETF data available for {symbol}
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
        The configured provider did not return a quote or fund profile. Check the symbol or try again later.
      </p>
    </section>
  );
}
