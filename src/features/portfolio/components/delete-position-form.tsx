"use client";

import { useActionState } from "react";
import { deletePortfolioPosition } from "@/features/portfolio/lib/actions";

export function DeletePositionForm({ id, symbol }: { id: string; symbol: string }) {
  const [state, action, pending] = useActionState(deletePortfolioPosition, { ok: false, message: "" });
  return <form action={action} className="flex items-center justify-end gap-3">
    <input type="hidden" name="id" value={id} />
    {state.message && !state.ok ? <span role="status" className="text-xs text-rose-300">{state.message}</span> : null}
    <button disabled={pending} aria-label={`Delete ${symbol} position`} className="rounded-md border border-rose-400/30 px-3 py-2 text-xs font-medium text-rose-200 hover:bg-rose-500/10 disabled:opacity-60">{pending ? "Deleting…" : "Delete"}</button>
  </form>;
}
