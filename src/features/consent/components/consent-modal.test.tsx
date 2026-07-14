import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { AppShell } from "./app-shell";
import { CONSENT_VERSION } from "@/features/consent/data/consent";
import { writeConsentState } from "@/features/consent/lib/storage";

describe("Consent modal", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("blocks first access until the checkbox is accepted", () => {
    render(
      <AppShell>
        <div>Protected content</div>
      </AppShell>,
    );

    expect(screen.getByText(/Research and education use only/i)).toBeTruthy();
    expect(screen.queryByText("Protected content")).toBeNull();

    const continueButton = screen.getByRole("button", { name: /continue/i });
    expect(continueButton.hasAttribute("disabled")).toBe(true);

    fireEvent.click(screen.getByRole("checkbox"));
    expect(continueButton.hasAttribute("disabled")).toBe(false);
  });

  it("persists consent and reuses it after acceptance", () => {
    render(
      <AppShell>
        <div>Protected content</div>
      </AppShell>,
    );

    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    expect(screen.getByText("Protected content")).toBeTruthy();
    expect(window.localStorage.getItem("ai-investor-consent")).toContain(CONSENT_VERSION);
  });

  it("requires acceptance again after the consent version changes", () => {
    writeConsentState({ isAccepted: true, version: "old-version" });

    render(
      <AppShell>
        <div>Protected content</div>
      </AppShell>,
    );

    expect(screen.getByText(/Research and education use only/i)).toBeTruthy();
  });
});
