import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TermsPage from "./terms/page";
import PrivacyPolicyPage from "./privacy-policy/page";
import RiskDisclosurePage from "./risk-disclosure/page";
import AiLimitationsPage from "./ai-limitations/page";
import { disclosureRoutes } from "@/features/consent/data/consent";

const pages = [
  { name: "Terms", Component: TermsPage },
  { name: "Privacy Policy", Component: PrivacyPolicyPage },
  { name: "Risk Disclosure", Component: RiskDisclosurePage },
  { name: "AI Limitations", Component: AiLimitationsPage },
];

describe("legal disclosure pages", () => {
  it.each(pages)("$name contains draft content and no placeholder copy", ({ Component }) => {
    const { container } = render(<Component />);

    expect(screen.getByText("AI Investor Assistant")).toBeTruthy();
    expect(screen.getByText(/Pre-production legal draft/i)).toBeTruthy();
    expect(container.textContent).not.toMatch(/placeholder|lorem ipsum|will be added later/i);
  });

  it.each(pages)("$name links to every disclosure route and the application", ({ Component }) => {
    const { container } = render(<Component />);

    disclosureRoutes.forEach((href) => {
      expect(container.querySelector(`a[href="${href}"]`)).toBeTruthy();
    });
    expect(container.querySelector('a[href="/"]')?.textContent).toContain("Return to application");
  });
});
