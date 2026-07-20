import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { AssetSearch } from "@/features/search/components/asset-search";
import { searchAssets } from "@/services/market-data";

export default async function EtfsPage({searchParams}:{searchParams:Promise<{q?:string}>}) {
  const query=((await searchParams).q??"").trim(); const result=query?await searchAssets(query):undefined;
  return (
    <DashboardLayout
      title="ETFs"
      description="Search sourced ETF listings and open fund research."
    >
      <AssetSearch query={query} kind="etfs" result={result} />
    </DashboardLayout>
  );
}
