import type { NavItem } from "@/features/dashboard/types/navigation";

export const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", description: "Overview and performance" },
  { href: "/stocks", label: "Stocks", description: "Equity snapshot" },
  { href: "/etfs", label: "ETFs", description: "Fund allocation" },
  { href: "/watchlist", label: "Watchlist", description: "Monitor ideas" },
  { href: "/portfolio", label: "Portfolio", description: "Holdings view" },
  { href: "/ai-research", label: "AI Research", description: "Research workspace" },
  { href: "/settings", label: "Settings", description: "Preferences" },
];
