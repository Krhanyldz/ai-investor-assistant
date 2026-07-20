"use server";

import { createSupabaseServerClient } from "@/features/auth/lib/auth";
import { CONSENT_VERSION } from "@/features/consent/data/consent";
import type { AuthenticatedConsentStatus } from "@/features/consent/types/consent";

interface ConsentRow {
  version: string;
  accepted_at: string;
}

export async function getCurrentConsentStatus(): Promise<AuthenticatedConsentStatus> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    return {
      isAuthenticated: false,
      hasAcceptedCurrentVersion: false,
      acceptedAt: null,
    };
  }

  const { data, error } = await supabase
    .from("user_consents")
    .select("version, accepted_at")
    .eq("user_id", user.id)
    .eq("version", CONSENT_VERSION)
    .maybeSingle<ConsentRow>();

  if (error) {
    throw new Error(error.message);
  }

  return {
    isAuthenticated: true,
    hasAcceptedCurrentVersion: Boolean(data),
    acceptedAt: data?.accepted_at ?? null,
  };
}

export async function acceptCurrentConsent(): Promise<ConsentRow> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .rpc("accept_current_user_consent", { consent_version: CONSENT_VERSION })
    .single<ConsentRow>();

  if (error || !data) {
    throw new Error(error?.message ?? "Consent acceptance could not be saved.");
  }

  return data;
}
