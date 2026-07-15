"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/features/dashboard/data/navigation";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { marketStripItems } from "@/features/dashboard/data/demo-content";
import { AIDisclaimer } from "@/features/consent/components/ai-disclaimer";

interface DashboardLayoutContentProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export function DashboardLayoutContent({ title, description, children }: DashboardLayoutContentProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isRouteActive = (href: string) => {
    const normalizedPathname = pathname?.replace(/\/+$/, "") || "/";
    const normalizedHref = href === "/" ? "/" : href.replace(/\/+$/, "");

    if (href === "/") {
      return normalizedPathname === "/" || normalizedPathname === "/dashboard";
    }

    return normalizedPathname === normalizedHref;
  };

  return (
    <div className="min-h-screen bg-[#05070b] text-zinc-100">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="hidden w-72 shrink-0 border-r border-zinc-800 bg-[#080b12] px-6 py-8 lg:flex lg:flex-col">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase text-zinc-500">AI Investor</p>
            <h2 className="text-xl font-semibold text-zinc-100">Workspace</h2>
          </div>
          <nav aria-label="Primary" className="mt-8 flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = isRouteActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-lg px-4 py-3 text-left transition-colors ${
                    isActive
                      ? "bg-emerald-500/15 text-emerald-100 ring-1 ring-emerald-400/30"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                  }`}
                >
                  <span className="block text-sm font-medium">{item.label}</span>
                  <span className="mt-1 block text-xs text-zinc-500">{item.description}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto flex flex-col gap-3 rounded-lg border border-zinc-800 bg-zinc-900/70 p-4">
            <div className="space-y-1">
              <p className="text-xs uppercase text-zinc-500">Demo mode</p>
              <p className="text-sm leading-6 text-zinc-300">
                Sample data only. No authentication, APIs, or charts are connected.
              </p>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="border-b border-zinc-800 bg-[#080b12]/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 text-zinc-200 hover:bg-zinc-900 lg:hidden"
                  aria-label="Open navigation menu"
                  aria-expanded={drawerOpen}
                  aria-controls="mobile-drawer"
                  onClick={() => setDrawerOpen((open) => !open)}
                >
                  <span className="text-lg" aria-hidden="true">
                    =
                  </span>
                </button>
                <div>
                  <p className="text-xs uppercase text-zinc-500">Premium dashboard shell</p>
                  <p className="text-sm text-zinc-400">Demo / sample data only</p>
                </div>
              </div>
              <div className="hidden rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-100 sm:block">
                Markets open - sample feed
              </div>
            </div>
          </header>

          <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-6 rounded-lg border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-sm text-zinc-400 sm:px-6">
              <p className="mb-3 text-xs font-medium uppercase text-zinc-500">Top market strip - sample data</p>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {marketStripItems.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-3 rounded-md bg-zinc-950/70 px-3 py-2">
                    <span className="font-medium text-zinc-200">{item.label}</span>
                    <span className="text-zinc-400">{item.value}</span>
                    <span className="font-medium text-emerald-300">{item.change}</span>
                  </div>
                ))}
              </div>
            </div>

            <PageHeader title={title} description={description} />

            <main className="mt-6">{children}</main>
            <AIDisclaimer />
          </div>
        </div>
      </div>

      {drawerOpen ? (
        <div className="fixed inset-0 z-40 bg-zinc-950/70 lg:hidden" role="presentation" onClick={() => setDrawerOpen(false)} />
      ) : null}

      <div
        id="mobile-drawer"
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] border-r border-zinc-800 bg-[#080b12] p-6 transition-transform duration-200 lg:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-zinc-500">AI Investor</p>
            <p className="text-lg font-semibold text-zinc-100">Workspace</p>
          </div>
          <button
            type="button"
            className="rounded-lg border border-zinc-700 px-3 py-2 text-zinc-300"
            aria-label="Close navigation menu"
            onClick={() => setDrawerOpen(false)}
          >
            X
          </button>
        </div>
        <nav aria-label="Mobile" className="mt-8 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = isRouteActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-lg px-4 py-3 text-left transition-colors ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-100 ring-1 ring-emerald-400/30"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                }`}
                onClick={() => setDrawerOpen(false)}
              >
                <span className="block text-sm font-medium">{item.label}</span>
                <span className="mt-1 block text-xs text-zinc-500">{item.description}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
