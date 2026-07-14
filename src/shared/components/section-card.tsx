import type { PageSection } from "@/shared/types/app";

interface SectionCardProps {
  section: PageSection;
}

export function SectionCard({ section }: SectionCardProps) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <h2 className="text-lg font-semibold text-zinc-900">{section.title}</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-600">{section.description}</p>
    </article>
  );
}
