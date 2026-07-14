import type { ReactNode } from "react";
import { createSupabaseServerClient } from "@/features/auth/lib/auth";
import { DashboardLayoutContent } from "@/features/dashboard/components/dashboard-layout-content";

interface DashboardLayoutProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export async function DashboardLayout({ title, description, children }: DashboardLayoutProps) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const userEmail = error ? null : user?.email ?? null;

  return (
    <DashboardLayoutContent title={title} description={description} userEmail={userEmail}>
      {children}
    </DashboardLayoutContent>
  );
}
