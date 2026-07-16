import type {
  DemoMetric,
  DemoSection,
  DemoWorkspace,
  MarketItem,
} from "@/features/dashboard/types/navigation";

export const marketStripItems: MarketItem[] = [
  { label: "S&P 500", value: "6,284.12", change: "+0.42%" },
  { label: "NASDAQ", value: "20,631.10", change: "+0.71%" },
  { label: "Dow", value: "44,459.65", change: "+0.25%" },
  { label: "BTC", value: "$117,850", change: "+1.12%" },
];

export const demoMetrics: DemoMetric[] = [
  { label: "Demo Portfolio Value", value: "$128,450", change: "+3.2%" },
  { label: "Demo Cash Balance", value: "$24,100", change: "+0.8%" },
  { label: "Sample Risk Score", value: "Moderate", change: "-0.4" },
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

export const demoWorkspaces: Record<string, DemoWorkspace> = {
  dashboard: {
    title: "Sample account overview",
    description:
      "A static dashboard preview for validating the premium shell before live market data or charts are added.",
    items: [
      { label: "Sample allocation", value: "62% equity", detail: "Demo blend across stocks, ETFs, and cash." },
      { label: "Demo momentum", value: "+2.8% MTD", detail: "Placeholder month-to-date movement." },
      { label: "Research queue", value: "7 notes", detail: "Static examples for future AI research workflows." },
    ],
  },
  stocks: {
    title: "Sample stock coverage",
    description: "Static stock ideas for layout validation. These are not recommendations and do not use an API.",
    items: [
      { label: "AAPL", value: "Quality watch", detail: "Demo mega-cap technology research placeholder." },
      { label: "MSFT", value: "AI infrastructure", detail: "Sample thesis card for future research summaries." },
      { label: "NVDA", value: "High volatility", detail: "Demo risk label prepared for future metrics." },
    ],
  },
  etfs: {
    title: "Sample ETF allocation",
    description: "Static ETF rows for future allocation and sector screens. No fund data is fetched.",
    items: [
      { label: "VTI", value: "Core equity", detail: "Demo total-market allocation placeholder." },
      { label: "VXUS", value: "International", detail: "Sample global diversification row." },
      { label: "BND", value: "Stability sleeve", detail: "Demo fixed-income role description." },
    ],
  },
  watchlist: {
    title: "Sample watchlist",
    description: "A labeled demo watchlist for future alerts and research triggers.",
    items: [
      { label: "Entry ideas", value: "12 symbols", detail: "Static count for workflow preview." },
      { label: "Needs review", value: "4 symbols", detail: "Demo triage bucket for upcoming AI notes." },
      { label: "Price alerts", value: "Inactive", detail: "Placeholder state only." },
    ],
  },
  portfolio: {
    title: "Sample portfolio",
    description: "A portfolio preview with demo balances and no brokerage account integration.",
    items: [
      { label: "Largest position", value: "14.2%", detail: "Demo concentration indicator." },
      { label: "Estimated cash", value: "$24,100", detail: "Static value copied from sample metrics." },
      { label: "Rebalance state", value: "On track", detail: "Placeholder policy status." },
    ],
  },
  "ai-research": {
    title: "Sample AI research desk",
    description: "Static research cards for a future AI-assisted workflow. No model or API call runs here.",
    items: [
      { label: "Briefing draft", value: "Ready", detail: "Demo status for generated market briefs." },
      { label: "Open questions", value: "5 prompts", detail: "Static prompts for future analyst review." },
      { label: "Source review", value: "Manual", detail: "Placeholder for future citations and evidence checks." },
    ],
  },
  settings: {
    title: "Sample settings",
    description: "Static preferences panel for layout validation. Values are not saved.",
    items: [
      { label: "Default theme", value: "Dark", detail: "Dashboard shell renders dark by default." },
      { label: "Market region", value: "US", detail: "Demo preference only." },
      { label: "Notifications", value: "Off", detail: "Placeholder until alerts are implemented." },
    ],
  },
};
