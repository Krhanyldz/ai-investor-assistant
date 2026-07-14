import type { PageSection } from "@/domain/app";

export function getHomeSections(): PageSection[] {
  return [
    {
      title: "Signal-first planning",
      description:
        "Organize research, watchlists, and decision notes around a consistent workflow.",
    },
    {
      title: "Structured review",
      description:
        "Capture entry, thesis, and risk assumptions in a format that scales with your portfolio.",
    },
    {
      title: "Reliable execution",
      description:
        "Prepare a durable foundation for richer portfolio insights in future releases.",
    },
  ];
}
