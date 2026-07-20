"use client";

import { useState } from "react";
import Link from "next/link";
import { consentText, CONSENT_VERSION } from "@/features/consent/data/consent";

interface ConsentModalProps {
  onAccept: () => Promise<void> | void;
  error?: string | null;
}

export function ConsentModal({ onAccept, error }: ConsentModalProps) {
  const [accepted, setAccepted] = useState(false);
  const [isPersisting, setIsPersisting] = useState(false);

  const handleContinue = async () => {
    setIsPersisting(true);
    try {
      await onAccept();
    } finally {
      setIsPersisting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-950/85 px-4 py-8">
      <div className="w-full max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl shadow-black/40 sm:p-8">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">Compliance and trust</p>
          <h2 className="text-2xl font-semibold text-zinc-100">{consentText.title}</h2>
          <p className="text-sm leading-7 text-zinc-400">{consentText.description}</p>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Consent version {CONSENT_VERSION}</p>
          <div className="flex flex-wrap gap-2">
            {consentText.links.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-zinc-300 underline underline-offset-4">
                {link.label}
              </Link>
            ))}
          </div>
          <label className="flex items-start gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 text-sm leading-6 text-zinc-300">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(event) => setAccepted(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-zinc-700 bg-zinc-950"
            />
            <span>I understand and accept these terms for using this research and education platform.</span>
          </label>
          {error ? (
            <p className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-3 text-sm leading-6 text-rose-100">
              {error}
            </p>
          ) : null}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleContinue}
              disabled={!accepted || isPersisting}
              className="rounded-full bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-950 transition-colors disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
            >
              {isPersisting ? "Saving..." : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
