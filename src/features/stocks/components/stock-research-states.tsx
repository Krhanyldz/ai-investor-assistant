import type { MarketDataError } from "@/domain/market-data";

export function StockResearchErrorCard({ title, errors }: { title: string; errors: MarketDataError[] }) {
  return (
    <section
      className="rounded-lg border border-rose-400/30 bg-rose-950/30 p-5 text-rose-100"
      aria-labelledby="stock-research-error-heading"
    >
      <h2 id="stock-research-error-heading" className="text-base font-semibold">
        {title}
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

export function StockResearchEmptyState({ symbol }: { symbol: string }) {
  return (
    <section
      className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-8 text-center"
      aria-labelledby="stock-empty-state-heading"
    >
      <p className="text-sm font-medium uppercase text-zinc-500">Empty state</p>
      <h2 id="stock-empty-state-heading" className="mt-3 text-xl font-semibold text-zinc-100">
        No market data available for {symbol}
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
        The provider did not return quote, company profile, or financial metrics data. Try another symbol later.
      </p>
    </section>
  );
}
