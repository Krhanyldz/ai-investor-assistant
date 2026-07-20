"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function ResearchLauncher() {
  const router = useRouter();
  const [symbol, setSymbol] = useState("AAPL");
  const [question, setQuestion] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedSymbol = symbol.trim().toUpperCase();
    if (!normalizedSymbol) return;
    const query = question.trim() ? `?question=${encodeURIComponent(question.trim())}` : "";
    router.push(`/ai-research/${encodeURIComponent(normalizedSymbol)}${query}`);
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-2xl space-y-5 rounded-lg border border-zinc-800 bg-zinc-900/80 p-6">
      <div>
        <label htmlFor="symbol" className="text-sm font-medium text-zinc-200">Asset symbol</label>
        <input id="symbol" value={symbol} onChange={(event) => setSymbol(event.target.value)} required autoCapitalize="characters" className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100" />
      </div>
      <div>
        <label htmlFor="question" className="text-sm font-medium text-zinc-200">Research question (optional)</label>
        <textarea id="question" value={question} onChange={(event) => setQuestion(event.target.value)} rows={3} placeholder="Explain the valuation assumptions and key risks." className="mt-2 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100" />
        <p className="mt-2 text-xs leading-5 text-zinc-400">Research only. Personalized buy, sell, allocation, or leverage recommendations are refused.</p>
      </div>
      <button type="submit" className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-950">Generate research</button>
    </form>
  );
}
