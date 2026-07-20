export const CONSENT_VERSION = "2026-07-16:legal-disclosures-v2";
export const CONSENT_LAST_UPDATED = "July 16, 2026";

export const disclosureRoutes = [
  "/terms",
  "/privacy-policy",
  "/risk-disclosure",
  "/ai-limitations",
] as const;

export function isDisclosureRoute(pathname: string | null): boolean {
  return disclosureRoutes.some((route) => pathname === route);
}

export function shouldBypassConsentGate(pathname: string | null): boolean {
  return isDisclosureRoute(pathname);
}

export const consentText = {
  title: "Research and education use only",
  description:
    "This platform is intended for research and education only. AI-generated output may be inaccurate, incomplete, or outdated. Users must independently verify important information before acting on it. This platform does not provide personalized investment advice.",
  links: [
    { href: "/terms", label: "Terms" },
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/risk-disclosure", label: "Risk Disclosure" },
    { href: "/ai-limitations", label: "AI Limitations" },
  ],
};
