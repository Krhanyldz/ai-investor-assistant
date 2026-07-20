import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { WatchlistView } from "@/features/watchlist/components/watchlist-view";
import { getWatchlistItems } from "@/features/watchlist/lib/actions";
import { getStockQuote } from "@/services/market-data";

export default async function WatchlistPage() {
  const result=await getWatchlistItems();
  const rows=await Promise.all(result.items.map(async item=>({...item,quote:await getStockQuote(item.symbol)})));
  return (
    <DashboardLayout
      title="Watchlist"
      description="Track research ideas with sourced market-data timestamps."
    >
      <WatchlistView rows={rows} error={result.error} />
    </DashboardLayout>
  );
}
