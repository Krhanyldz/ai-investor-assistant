"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CONSENT_VERSION, shouldBypassConsentGate } from "@/features/consent/data/consent";
import { ConsentModal } from "@/features/consent/components/consent-modal";
import {
  hasValidConsent,
  readConsentState,
  writeConsentState,
} from "@/features/consent/lib/storage";
import {
  acceptCurrentConsent,
  getCurrentConsentStatus,
} from "@/features/consent/lib/actions";

interface AppShellProps {
  children: ReactNode;
}

type ConsentStatus = "loading" | "required" | "accepted";

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [consentState, setConsentState] =
    useState<ConsentStatus>("loading");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [persistenceError, setPersistenceError] = useState<string | null>(null);
  const [requiresVerificationAfterBypass, setRequiresVerificationAfterBypass] = useState(false);

  const bypassConsentGate = shouldBypassConsentGate(pathname);

  useEffect(() => {
    if (bypassConsentGate) {
      queueMicrotask(() => setRequiresVerificationAfterBypass(true));
      return;
    }

    let cancelled = false;

    queueMicrotask(async () => {
      if (cancelled) {
        return;
      }

      const stored = readConsentState();
      const hasCurrentLocalConsent = hasValidConsent(stored, CONSENT_VERSION);

      try {
        const remoteStatus = await getCurrentConsentStatus();

        if (cancelled) {
          return;
        }

        setIsAuthenticated(remoteStatus.isAuthenticated);

        if (remoteStatus.hasAcceptedCurrentVersion) {
          setRequiresVerificationAfterBypass(false);
          setConsentState("accepted");
          return;
        }

        if (remoteStatus.isAuthenticated && hasCurrentLocalConsent) {
          const persisted = await acceptCurrentConsent();

          if (cancelled) {
            return;
          }

          writeConsentState({
            isAccepted: true,
            version: CONSENT_VERSION,
            acceptedAt: persisted.accepted_at,
          });
          setRequiresVerificationAfterBypass(false);
          setConsentState("accepted");
          return;
        }

        setRequiresVerificationAfterBypass(false);
        setConsentState(hasCurrentLocalConsent && !remoteStatus.isAuthenticated ? "accepted" : "required");
      } catch {
        if (!cancelled) {
          setIsAuthenticated(true);
          setPersistenceError("Consent status could not be verified. Try again before continuing.");
          setConsentState("required");
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [bypassConsentGate]);

  const handleAccept = async () => {
    setPersistenceError(null);

    if (!isAuthenticated) {
      writeConsentState({
        isAccepted: true,
        version: CONSENT_VERSION,
        acceptedAt: new Date().toISOString(),
      });
      setConsentState("accepted");
      return;
    }

    try {
      const persisted = await acceptCurrentConsent();
      writeConsentState({
        isAccepted: true,
        version: CONSENT_VERSION,
        acceptedAt: persisted.accepted_at,
      });
      setConsentState("accepted");
    } catch {
      setPersistenceError("Consent acceptance could not be saved. Check your connection and try again.");
      setConsentState("required");
    }
  };

  if (bypassConsentGate) {
    return <>{children}</>;
  }

  if (consentState === "loading" || requiresVerificationAfterBypass) {
    return (
      <div
        className="min-h-screen bg-zinc-950"
        aria-busy="true"
        aria-label="Loading application"
      />
    );
  }

  if (consentState === "required") {
    return (
      <ConsentModal
        onAccept={handleAccept}
        error={persistenceError}
      />
    );
  }

  return <>{children}</>;
}
