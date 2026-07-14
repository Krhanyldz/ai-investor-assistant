import { SectionCard } from "@/shared/components/section-card";
import { appConfig } from "@/config/app";
import { getHomeSections } from "@/services/app-content";

export function HomePage() {
  const sections = getHomeSections();

  return (
    <main className="flex min-h-screen flex-col bg-zinc-50 px-6 py-16 text-zinc-900 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
            {appConfig.appName}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Build a calmer, sharper investing workflow.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
            {appConfig.appDescription}
          </p>
          <a
            href={`mailto:${appConfig.supportEmail}`}
            className="mt-8 inline-flex rounded-full bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
          >
            Contact the team
          </a>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {sections.map((section) => (
            <SectionCard key={section.title} section={section} />
          ))}
        </section>
      </div>
    </main>
  );
}
