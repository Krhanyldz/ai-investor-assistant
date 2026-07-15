import type { ReactNode } from "react";
import { DashboardLayoutContent } from "@/features/dashboard/components/dashboard-layout-content";

interface DashboardLayoutProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export function DashboardLayout({ title, description, children }: DashboardLayoutProps) {
  return (
    <DashboardLayoutContent title={title} description={description}>
      {children}
    </DashboardLayoutContent>
  );
}
