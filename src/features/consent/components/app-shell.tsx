"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { CONSENT_VERSION } from "@/features/consent/data/consent";
import { ConsentModal } from "@/features/consent/components/consent-modal";
import {
  hasValidConsent,
  readConsentState,
} from "@/features/consent/lib/storage";

interface AppShellProps {
  children: ReactNode;
}

type ConsentStatus = "loading" | "required" | "accepted";

export function AppShell({ children }: AppShellProps) {
  const [consentState, setConsentState] =
    useState<ConsentStatus>("loading");

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) {
        return;
      }

      const stored = readConsentState();
      const nextState: ConsentStatus = hasValidConsent(
        stored,
        CONSENT_VERSION,
      )
        ? "accepted"
        : "required";

      setConsentState(nextState);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (consentState === "loading") {
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
        onAccept={() => setConsentState("accepted")}
      />
    );
  }

  return <>{children}</>;
}