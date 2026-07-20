import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";
import { getPortfolioPositions } from "@/features/portfolio/lib/actions";
import { getWatchlistItems } from "@/features/watchlist/lib/actions";

export default async function HomePage() {
  const [portfolio,watchlist]=await Promise.all([getPortfolioPositions(),getWatchlistItems()]);
  return (
    <DashboardLayout
      title="Dashboard"
      description="Your saved research and manually entered portfolio at a glance."
    >
      <DashboardOverview positions={portfolio.positions} watchlist={watchlist.items} portfolioError={portfolio.error} watchlistError={watchlist.error} />
    </DashboardLayout>
  );
}
