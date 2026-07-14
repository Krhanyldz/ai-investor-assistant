import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { beforeEach, describe, expect, it } from "vitest";
import { AppShell } from "./app-shell";
import { CONSENT_VERSION } from "@/features/consent/data/consent";
import { writeConsentState } from "@/features/consent/lib/storage";

describe("Consent modal", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the same initial markup on the server and client before consent is resolved", () => {
    const serverMarkup = renderToString(
      <AppShell>
        <div>Protected content</div>
      </AppShell>,
    );

    const { container } = render(
      <AppShell>
        <div>Protected content</div>
      </AppShell>,
    );

    expect(container.innerHTML).toBe(serverMarkup);
  });

  it("blocks first access until the checkbox is accepted", async () => {
    render(
      <AppShell>
        <div>Protected content</div>
      </AppShell>,
    );

    expect(await screen.findByText(/Research and education use only/i)).toBeTruthy();
    expect(screen.queryByText("Protected content")).toBeNull();

    const continueButton = screen.getByRole("button", { name: /continue/i });
    expect(continueButton.hasAttribute("disabled")).toBe(true);

    fireEvent.click(screen.getByRole("checkbox"));

    await waitFor(() => {
      expect(continueButton.hasAttribute("disabled")).toBe(false);
    });
  });

  it("persists consent and reuses it after acceptance", async () => {
    render(
      <AppShell>
        <div>Protected content</div>
      </AppShell>,
    );

    fireEvent.click(await screen.findByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    expect(await screen.findByText("Protected content")).toBeTruthy();
    expect(window.localStorage.getItem("ai-investor-consent")).toContain(
      CONSENT_VERSION,
    );
  });

  it("requires acceptance again after the consent version changes", async () => {
    writeConsentState({ isAccepted: true, version: "old-version" });

    render(
      <AppShell>
        <div>Protected content</div>
      </AppShell>,
    );

    expect(await screen.findByText(/Research and education use only/i)).toBeTruthy();
  });
});