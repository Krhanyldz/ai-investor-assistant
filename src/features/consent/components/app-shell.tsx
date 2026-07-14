"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { CONSENT_VERSION } from "@/features/consent/data/consent";
import { ConsentModal } from "@/features/consent/components/consent-modal";
import { hasValidConsent, readConsentState } from "@/features/consent/lib/storage";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [consentAccepted, setConsentAccepted] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const stored = readConsentState();
    return hasValidConsent(stored, CONSENT_VERSION);
  });

  const shouldShowConsent = useMemo(() => !consentAccepted, [consentAccepted]);

  if (shouldShowConsent) {
    return <ConsentModal onAccept={() => setConsentAccepted(true)} />;
  }

  return <>{children}</>;
}
