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
      acceptedAt: typeof parsed.acceptedAt === "string" ? parsed.acceptedAt : null,
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
    acceptedAt: state.acceptedAt ?? new Date().toISOString(),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
}

export function hasValidConsent(state: ConsentState | null, currentVersion: string): boolean {
  if (!state?.isAccepted || state.version !== currentVersion || !state.acceptedAt) {
    return false;
  }

  return !Number.isNaN(Date.parse(state.acceptedAt));
}
