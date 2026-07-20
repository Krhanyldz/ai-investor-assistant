function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-md bg-zinc-800/80 ${className}`} />;
}

export function EtfResearchSkeleton() {
  return (
    <div className="space-y-6" aria-label="Loading ETF research">
      <section className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-5">
        <SkeletonBlock className="h-5 w-32" />
        <SkeletonBlock className="mt-4 h-10 w-64" />
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <SkeletonBlock className="h-20" />
          <SkeletonBlock className="h-20" />
          <SkeletonBlock className="h-20" />
        </div>
      </section>
      <div className="grid gap-6 xl:grid-cols-2">
        <SkeletonBlock className="h-72" />
        <SkeletonBlock className="h-72" />
        <SkeletonBlock className="h-56" />
        <SkeletonBlock className="h-56" />
      </div>
    </div>
  );
}
