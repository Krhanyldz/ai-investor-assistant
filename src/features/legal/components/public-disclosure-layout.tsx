import type { ReactNode } from "react";
import Link from "next/link";
import { CONSENT_LAST_UPDATED, CONSENT_VERSION, disclosureRoutes } from "@/features/consent/data/consent";

const disclosureLabels: Record<(typeof disclosureRoutes)[number], string> = {
  "/terms": "Terms",
  "/privacy-policy": "Privacy Policy",
  "/risk-disclosure": "Risk Disclosure",
  "/ai-limitations": "AI Limitations",
};

interface PublicDisclosureLayoutProps {
  title: string;
  children: ReactNode;
}

export function PublicDisclosureLayout({ title, children }: PublicDisclosureLayoutProps) {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="border-b border-zinc-800 pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-zinc-500">AI Investor Assistant</p>
              <h1 className="mt-3 text-3xl font-semibold text-zinc-50">{title}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">
                Pre-production legal draft. Production launch is blocked until the legal review checklist is complete.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex rounded-full border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-900"
            >
              Return to application
            </Link>
          </div>
          <dl className="mt-6 grid gap-3 text-sm text-zinc-400 sm:grid-cols-2">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
              <dt className="font-medium text-zinc-200">Last updated</dt>
              <dd className="mt-1">{CONSENT_LAST_UPDATED}</dd>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
              <dt className="font-medium text-zinc-200">Consent version</dt>
              <dd className="mt-1">{CONSENT_VERSION}</dd>
            </div>
          </dl>
          <nav aria-label="Legal disclosures" className="mt-6 flex flex-wrap gap-2">
            {disclosureRoutes.map((href) => (
              <Link
                key={href}
                href={href}
                className="rounded-full border border-zinc-800 px-3 py-2 text-sm text-zinc-300 hover:border-zinc-600 hover:bg-zinc-900"
              >
                {disclosureLabels[href]}
              </Link>
            ))}
          </nav>
        </header>
        <article className="prose prose-invert max-w-none prose-headings:text-zinc-100 prose-p:text-zinc-300 prose-li:text-zinc-300">
          {children}
        </article>
      </div>
    </main>
  );
}
