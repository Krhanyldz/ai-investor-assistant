import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { AssetSearch } from "@/features/search/components/asset-search";
import { searchAssets } from "@/services/market-data";

export default async function StocksPage({searchParams}:{searchParams:Promise<{q?:string}>}) {
  const query=((await searchParams).q??"").trim(); const result=query?await searchAssets(query):undefined;
  return (
    <DashboardLayout
      title="Stocks"
      description="Search sourced equity listings and open detailed research."
    >
      <AssetSearch query={query} kind="stocks" result={result} />
    </DashboardLayout>
  );
}
