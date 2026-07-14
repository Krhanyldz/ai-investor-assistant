import type { ReactNode } from "react";

interface PanelCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function PanelCard({ title, description, children }: PanelCardProps) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg shadow-black/20">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-zinc-100">{title}</h2>
        <p className="text-sm leading-6 text-zinc-400">{description}</p>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
