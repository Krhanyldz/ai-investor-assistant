import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { SettingsOverview } from "@/features/settings/components/settings-overview";
import { requireAuthenticatedUser } from "@/features/auth/lib/auth";
import { getCurrentConsentStatus } from "@/features/consent/lib/actions";

export default async function SettingsPage() {
  const user=await requireAuthenticatedUser();
  let acceptedAt:string|null=null; let consentError=false;
  try{acceptedAt=(await getCurrentConsentStatus()).acceptedAt;}catch{consentError=true;}
  return (
    <DashboardLayout
      title="Settings"
      description="Review account, legal consent, and server integration status."
    >
      <SettingsOverview email={user?.email??"Unavailable"} displayName={typeof user?.user_metadata?.display_name==="string"?user.user_metadata.display_name:null} consentAcceptedAt={acceptedAt} consentError={consentError} services={{supabase:Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),finnhub:Boolean(process.env.FINNHUB_API_KEY),openai:Boolean(process.env.OPENAI_API_KEY)}} />
    </DashboardLayout>
  );
}
