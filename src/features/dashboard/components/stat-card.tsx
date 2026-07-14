interface StatCardProps {
  label: string;
  value: string;
  change: string;
}

export function StatCard({ label, value, change }: StatCardProps) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/80 p-4">
      <p className="text-sm text-zinc-400">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-xl font-semibold text-zinc-100">{value}</p>
        <span className="text-sm font-medium text-emerald-400">{change}</span>
      </div>
    </div>
  );
}
