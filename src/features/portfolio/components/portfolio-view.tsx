import type { PortfolioPosition } from "@/domain/portfolio";
import { DeletePositionForm } from "@/features/portfolio/components/delete-position-form";
import { PositionForm } from "@/features/portfolio/components/position-form";

function number(value: number, maximumFractionDigits = 8) { return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(value); }
function money(value: number, currency: string) {
  try { return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value); }
  catch { return `${number(value, 2)} ${currency}`; }
}

export function PortfolioView({ positions, error }: { positions: PortfolioPosition[]; error?: string }) {
  const totals = positions.reduce<Record<string, number>>((values, position) => {
    values[position.currency] = (values[position.currency] ?? 0) + position.quantity * position.averageCost;
    return values;
  }, {});

  return <div className="space-y-6">
    <PositionForm />
    <section aria-labelledby="portfolio-positions-heading" className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><h2 id="portfolio-positions-heading" className="text-lg font-semibold text-zinc-100">Your positions</h2><p className="mt-1 text-sm text-zinc-400">Totals show entered cost basis only—not live market value, gains, or advice.</p></div>
        {Object.entries(totals).length ? <dl className="flex flex-wrap gap-3">{Object.entries(totals).map(([currency, total]) => <div key={currency} className="rounded-md bg-zinc-950 px-3 py-2"><dt className="text-xs text-zinc-500">Cost basis ({currency})</dt><dd className="mt-1 font-semibold text-zinc-100">{money(total, currency)}</dd></div>)}</dl> : null}
      </div>
      {error ? <div role="alert" className="mt-5 rounded-md border border-rose-400/30 bg-rose-950/30 p-4 text-sm text-rose-100">{error} Try again later.</div> : positions.length === 0 ? <div className="mt-5 rounded-md border border-dashed border-zinc-700 p-8 text-center"><h3 className="font-medium text-zinc-200">No positions yet</h3><p className="mt-2 text-sm text-zinc-400">Add your first manually entered position above.</p></div> : <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><caption className="sr-only">Manually entered portfolio positions</caption><thead className="border-b border-zinc-700 text-xs uppercase text-zinc-500"><tr><th className="px-3 py-3">Symbol</th><th className="px-3 py-3">Quantity</th><th className="px-3 py-3">Average cost</th><th className="px-3 py-3">Cost basis</th><th className="px-3 py-3"><span className="sr-only">Actions</span></th></tr></thead><tbody>{positions.map((position) => <tr key={position.id} className="border-b border-zinc-800 last:border-0"><th scope="row" className="px-3 py-4 font-semibold text-zinc-100">{position.symbol}</th><td className="px-3 py-4 text-zinc-300">{number(position.quantity)}</td><td className="px-3 py-4 text-zinc-300">{money(position.averageCost, position.currency)}</td><td className="px-3 py-4 text-zinc-200">{money(position.quantity * position.averageCost, position.currency)}</td><td className="px-3 py-4"><DeletePositionForm id={position.id} symbol={position.symbol} /></td></tr>)}</tbody></table></div>}
    </section>
  </div>;
}
