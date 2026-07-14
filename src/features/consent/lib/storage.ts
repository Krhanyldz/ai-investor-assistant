"use client";

import type { ConsentRecord, ConsentState } from "@/features/consent/types/consent";

const STORAGE_KEY = "ai-investor-consent";

export function readConsentState(): ConsentState | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as ConsentRecord;
    return {
      isAccepted: Boolean(parsed.accepted),
      version: parsed.version,
    };
  } catch {
    return null;
  }
}

export function writeConsentState(state: ConsentState): void {
  if (typeof window === "undefined") {
    return;
  }

  const record: ConsentRecord = {
    accepted: state.isAccepted,
    version: state.version,
    acceptedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
}

export function hasValidConsent(state: ConsentState | null, currentVersion: string): boolean {
  return Boolean(state?.isAccepted && state.version === currentVersion);
}
