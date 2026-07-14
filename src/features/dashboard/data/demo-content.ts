import type { DemoMetric, DemoSection } from "@/features/dashboard/types/navigation";

export const demoMetrics: DemoMetric[] = [
  { label: "Portfolio Value", value: "$128,450", change: "+3.2%" },
  { label: "Cash Balance", value: "$24,100", change: "+0.8%" },
  { label: "Risk Score", value: "Moderate", change: "-0.4" },
];

export const demoSections: DemoSection[] = [
  {
    title: "Sample research overview",
    description:
      "This dashboard shell uses demo/sample data only and is prepared for future analytics and portfolio workflows.",
  },
  {
    title: "Watchlist prep",
    description:
      "The layout is ready for upcoming market context, alerts, and deeper research panels.",
  },
];
