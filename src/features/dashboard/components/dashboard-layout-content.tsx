"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { navItems } from "@/features/dashboard/data/navigation";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { PanelCard } from "@/features/dashboard/components/panel-card";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { demoMetrics, demoSections } from "@/features/dashboard/data/demo-content";
import { AIDisclaimer } from "@/features/consent/components/ai-disclaimer";

interface DashboardLayoutContentProps {
  title: string;
  description: string;
  children?: ReactNode;
  userEmail?: string | null;
}

export function DashboardLayoutContent({ title, description, children, userEmail }: DashboardLayoutContentProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  const isRouteActive = (href: string) => {
    const normalizedPathname = pathname?.replace(/\/+$/, "") || "/";
    const normalizedHref = href === "/" ? "/" : href.replace(/\/+$/, "");

    if (href === "/") {
      return normalizedPathname === "/" || normalizedPathname === "/dashboard";
    }

    return normalizedPathname === normalizedHref;
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setSignOutError(null);

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    );

    const { error } = await supabase.auth.signOut();

    if (error) {
      setSignOutError(error.message);
      setIsSigningOut(false);
      return;
    }

    router.refresh();
    router.replace("/sign-in");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="hidden w-72 shrink-0 border-r border-zinc-800 bg-zinc-950/95 px-6 py-8 lg:flex lg:flex-col">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">AI Investor</p>
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
                  className={`rounded-xl px-4 py-3 text-left transition-colors ${
                    isActive
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                  }`}
                >
                  <span className="block text-sm font-medium">{item.label}</span>
                  <span className="mt-1 block text-xs text-zinc-500">{item.description}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Signed in</p>
              <p className="truncate text-sm font-medium text-zinc-100">{userEmail ?? "Signed out"}</p>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSigningOut ? "Signing out..." : "Sign out"}
            </button>
            {signOutError ? <p className="text-sm text-rose-400">{signOutError}</p> : null}
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="border-b border-zinc-800 bg-zinc-950/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 text-zinc-200 hover:bg-zinc-900 lg:hidden"
                  aria-label="Open navigation menu"
                  aria-expanded={drawerOpen}
                  aria-controls="mobile-drawer"
                  onClick={() => setDrawerOpen((open) => !open)}
                >
                  <span className="text-lg">☰</span>
                </button>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Premium shell</p>
                  <p className="text-sm text-zinc-400">Demo / sample data only</p>
                </div>
              </div>
              <div className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-300">
                S&P 500 • +0.42%
              </div>
            </div>
          </header>

          <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-sm text-zinc-400 sm:px-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs uppercase tracking-[0.24em] text-zinc-500">
                  Market strip
                </span>
                <span>NASDAQ • +0.71%</span>
                <span>Dow • +0.25%</span>
                <span>BTC • +1.12%</span>
              </div>
            </div>

            <PageHeader title={title} description={description} />

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {demoMetrics.map((metric) => (
                <StatCard key={metric.label} label={metric.label} value={metric.value} change={metric.change} />
              ))}
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
              <PanelCard title="Workspace overview" description="This is a polished shell prepared for future portfolio analytics.">
                <div className="space-y-4">
                  {demoSections.map((section) => (
                    <div key={section.title} className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
                      <h3 className="text-sm font-semibold text-zinc-100">{section.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-zinc-400">{section.description}</p>
                    </div>
                  ))}
                </div>
              </PanelCard>

              <PanelCard title="Upcoming modules" description="Future features will slot into this structure without rework.">
                <ul className="space-y-3 text-sm text-zinc-400">
                  <li className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">Portfolio watchlists and scenario planning</li>
                  <li className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">Research summaries and AI-assisted notes</li>
                  <li className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">Custom settings and alert preferences</li>
                </ul>
              </PanelCard>
            </div>

            {children}
            <AIDisclaimer />
          </div>
        </div>
      </div>

      {drawerOpen ? (
        <div className="fixed inset-0 z-40 bg-zinc-950/70 lg:hidden" role="presentation" onClick={() => setDrawerOpen(false)} />
      ) : null}

      <div
        id="mobile-drawer"
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] border-r border-zinc-800 bg-zinc-950 p-6 transition-transform duration-200 lg:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">AI Investor</p>
            <p className="text-lg font-semibold text-zinc-100">Workspace</p>
          </div>
          <button
            type="button"
            className="rounded-full border border-zinc-700 p-2 text-zinc-300"
            aria-label="Close navigation menu"
            onClick={() => setDrawerOpen(false)}
          >
            ✕
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
                className={`rounded-xl px-4 py-3 text-left transition-colors ${
                  isActive
                    ? "bg-zinc-800 text-white"
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
