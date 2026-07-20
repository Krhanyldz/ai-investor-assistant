import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppShell } from "./app-shell";
import { CONSENT_VERSION, disclosureRoutes } from "@/features/consent/data/consent";
import { writeConsentState } from "@/features/consent/lib/storage";
import { acceptCurrentConsent, getCurrentConsentStatus } from "@/features/consent/lib/actions";

let currentPathname = "/";

vi.mock("next/navigation", () => ({
  usePathname: () => currentPathname,
}));

vi.mock("@/features/consent/lib/actions", () => ({
  acceptCurrentConsent: vi.fn(),
  getCurrentConsentStatus: vi.fn(),
}));

const getCurrentConsentStatusMock = vi.mocked(getCurrentConsentStatus);
const acceptCurrentConsentMock = vi.mocked(acceptCurrentConsent);

describe("Consent modal", () => {
  beforeEach(() => {
    currentPathname = "/";
    window.localStorage.clear();
    getCurrentConsentStatusMock.mockReset();
    acceptCurrentConsentMock.mockReset();
    getCurrentConsentStatusMock.mockResolvedValue({
      isAuthenticated: false,
      hasAcceptedCurrentVersion: false,
      acceptedAt: null,
    });
    acceptCurrentConsentMock.mockResolvedValue({
      version: CONSENT_VERSION,
      accepted_at: "2026-07-16T12:00:00.000Z",
    });
  });

  it("renders the same initial markup on the server and client before consent is resolved", () => {
    getCurrentConsentStatusMock.mockReturnValue(new Promise(() => undefined));

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

  it.each(disclosureRoutes)("bypasses the consent gate for disclosure route %s", async (route) => {
    currentPathname = route;

    render(
      <AppShell>
        <div>Disclosure content</div>
      </AppShell>,
    );

    await waitFor(() => {
      expect(screen.getByText("Disclosure content")).toBeTruthy();
    });
    expect(screen.queryByRole("button", { name: /continue/i })).toBeNull();
    expect(getCurrentConsentStatusMock).not.toHaveBeenCalled();
  });

  it("blocks non-disclosure protected content before consent", async () => {
    currentPathname = "/portfolio";

    render(
      <AppShell>
        <div>Protected content</div>
      </AppShell>,
    );

    expect(await screen.findByText(/Research and education use only/i)).toBeTruthy();
    expect(screen.queryByText("Protected content")).toBeNull();
  });

  it("gates sign-in before explicit signed-out consent", async () => {
    currentPathname = "/sign-in";

    render(
      <AppShell>
        <div>Sign in form</div>
      </AppShell>,
    );

    expect(await screen.findByText(/Research and education use only/i)).toBeTruthy();
    expect(screen.queryByText("Sign in form")).toBeNull();
  });

  it("requires checkbox acceptance before continuing", async () => {
    render(
      <AppShell>
        <div>Protected content</div>
      </AppShell>,
    );

    const continueButton = await screen.findByRole("button", { name: /continue/i });
    expect(continueButton.hasAttribute("disabled")).toBe(true);

    fireEvent.click(screen.getByRole("checkbox"));

    await waitFor(() => {
      expect(continueButton.hasAttribute("disabled")).toBe(false);
    });
  });

  it("persists signed-out consent with version and acceptedAt timestamp", async () => {
    render(
      <AppShell>
        <div>Protected content</div>
      </AppShell>,
    );

    fireEvent.click(await screen.findByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    expect(await screen.findByText("Protected content")).toBeTruthy();

    const stored = JSON.parse(window.localStorage.getItem("ai-investor-consent") ?? "{}") as {
      accepted?: boolean;
      version?: string;
      acceptedAt?: string;
    };
    expect(stored.accepted).toBe(true);
    expect(stored.version).toBe(CONSENT_VERSION);
    expect(typeof stored.acceptedAt).toBe("string");
    expect(Number.isNaN(Date.parse(stored.acceptedAt ?? ""))).toBe(false);
  });

  it("reuses signed-out consent for repeat visits with the current version", async () => {
    writeConsentState({ isAccepted: true, version: CONSENT_VERSION, acceptedAt: "2026-07-16T12:00:00.000Z" });

    render(
      <AppShell>
        <div>Protected content</div>
      </AppShell>,
    );

    expect(await screen.findByText("Protected content")).toBeTruthy();
  });

  it("requires renewed acceptance for an old consent version", async () => {
    writeConsentState({ isAccepted: true, version: "2026-07-14:research-education-v1", acceptedAt: "2026-07-14T12:00:00.000Z" });

    render(
      <AppShell>
        <div>Protected content</div>
      </AppShell>,
    );

    expect(await screen.findByText(/Research and education use only/i)).toBeTruthy();
    expect(screen.queryByText("Protected content")).toBeNull();
  });

  it.each([
    ["missing", { accepted: true, version: CONSENT_VERSION }],
    ["empty", { accepted: true, version: CONSENT_VERSION, acceptedAt: "" }],
    ["malformed", { accepted: true, version: CONSENT_VERSION, acceptedAt: "not-a-date" }],
  ])("requires renewed acceptance when signed-out consent has a %s timestamp", async (_label, record) => {
    window.localStorage.setItem("ai-investor-consent", JSON.stringify(record));

    render(
      <AppShell>
        <div>Protected content</div>
      </AppShell>,
    );

    expect(await screen.findByText(/Research and education use only/i)).toBeTruthy();
    expect(screen.queryByText("Protected content")).toBeNull();
  });

  it("unlocks content after authenticated database consent succeeds", async () => {
    getCurrentConsentStatusMock.mockResolvedValue({
      isAuthenticated: true,
      hasAcceptedCurrentVersion: false,
      acceptedAt: null,
    });

    render(
      <AppShell>
        <div>Protected content</div>
      </AppShell>,
    );

    fireEvent.click(await screen.findByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    expect(await screen.findByText("Protected content")).toBeTruthy();
    expect(acceptCurrentConsentMock).toHaveBeenCalled();
  });

  it("keeps content locked and shows a recoverable error when authenticated persistence fails", async () => {
    getCurrentConsentStatusMock.mockResolvedValue({
      isAuthenticated: true,
      hasAcceptedCurrentVersion: false,
      acceptedAt: null,
    });
    acceptCurrentConsentMock.mockRejectedValue(new Error("database unavailable"));

    render(
      <AppShell>
        <div>Protected content</div>
      </AppShell>,
    );

    fireEvent.click(await screen.findByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    expect(await screen.findByText(/Consent acceptance could not be saved/i)).toBeTruthy();
    expect(screen.queryByText("Protected content")).toBeNull();
  });

  it("synchronizes valid signed-out consent after authentication", async () => {
    writeConsentState({ isAccepted: true, version: CONSENT_VERSION, acceptedAt: "2026-07-16T12:00:00.000Z" });
    getCurrentConsentStatusMock.mockResolvedValue({
      isAuthenticated: true,
      hasAcceptedCurrentVersion: false,
      acceptedAt: null,
    });

    render(
      <AppShell>
        <div>Protected content</div>
      </AppShell>,
    );

    expect(await screen.findByText("Protected content")).toBeTruthy();
    expect(acceptCurrentConsentMock).toHaveBeenCalledTimes(1);
  });

  it("does not render stale protected content when navigating from a disclosure route to a gated route", async () => {
    currentPathname = "/terms";
    getCurrentConsentStatusMock.mockResolvedValue({
      isAuthenticated: true,
      hasAcceptedCurrentVersion: true,
      acceptedAt: "2026-07-16T12:00:00.000Z",
    });

    const { rerender } = render(
      <AppShell>
        <div>Public disclosure</div>
      </AppShell>,
    );

    expect(screen.getByText("Public disclosure")).toBeTruthy();
    await waitFor(() => {
      expect(screen.getByText("Public disclosure")).toBeTruthy();
    });

    let resolveStatus: (value: Awaited<ReturnType<typeof getCurrentConsentStatus>>) => void = () => undefined;
    getCurrentConsentStatusMock.mockReturnValue(new Promise((resolve) => {
      resolveStatus = resolve;
    }));
    currentPathname = "/portfolio";
    rerender(
      <AppShell>
        <div>Protected content</div>
      </AppShell>,
    );

    expect(screen.queryByText("Protected content")).toBeNull();
    expect(screen.getByLabelText(/loading application/i)).toBeTruthy();

    resolveStatus({
      isAuthenticated: true,
      hasAcceptedCurrentVersion: true,
      acceptedAt: "2026-07-16T12:00:00.000Z",
    });

    expect(await screen.findByText("Protected content")).toBeTruthy();
  });
});
