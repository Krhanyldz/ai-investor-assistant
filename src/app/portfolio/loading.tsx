import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";

export default function PortfolioLoading() {
  return <DashboardLayout title="Portfolio" description="Loading your manually entered holdings."><div aria-label="Loading portfolio" role="status" className="space-y-4 animate-pulse"><div className="h-48 rounded-lg bg-zinc-900" /><div className="h-64 rounded-lg bg-zinc-900" /></div></DashboardLayout>;
}
