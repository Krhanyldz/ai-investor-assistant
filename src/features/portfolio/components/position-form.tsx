"use client";

import { useActionState } from "react";
import { addPortfolioPosition } from "@/features/portfolio/lib/actions";

const initialState = { ok: false, message: "" };

export function PositionForm() {
  const [state, action, pending] = useActionState(addPortfolioPosition, initialState);
  return (
    <form action={action} className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-5">
      <h2 className="text-lg font-semibold text-zinc-100">Add position</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <label className="text-sm text-zinc-300">Symbol<input name="symbol" required maxLength={15} autoCapitalize="characters" placeholder="AAPL" className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 uppercase text-zinc-100" /></label>
        <label className="text-sm text-zinc-300">Quantity<input name="quantity" required type="number" min="0.00000001" max="1000000000000" step="any" inputMode="decimal" className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100" /></label>
        <label className="text-sm text-zinc-300">Average cost<input name="averageCost" required type="number" min="0.0001" max="1000000000000" step="any" inputMode="decimal" className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100" /></label>
        <label className="text-sm text-zinc-300">Currency<input name="currency" required defaultValue="USD" minLength={3} maxLength={3} autoCapitalize="characters" className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 uppercase text-zinc-100" /></label>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button disabled={pending} className="rounded-md bg-emerald-400 px-4 py-2 text-sm font-semibold text-zinc-950 disabled:cursor-wait disabled:opacity-60">{pending ? "Saving…" : "Add position"}</button>
        {state.message ? <p role="status" className={state.ok ? "text-sm text-emerald-300" : "text-sm text-rose-300"}>{state.message}</p> : null}
      </div>
    </form>
  );
}
