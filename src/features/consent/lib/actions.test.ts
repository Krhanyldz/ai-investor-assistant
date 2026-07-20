import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthSessionMissingError } from "@supabase/supabase-js";
import { CONSENT_VERSION } from "@/features/consent/data/consent";

const {
  createSupabaseServerClientMock,
  getUserMock,
  fromMock,
  rpcMock,
  selectMock,
  eqMock,
  maybeSingleMock,
  singleMock,
} = vi.hoisted(() => ({
  createSupabaseServerClientMock: vi.fn(),
  getUserMock: vi.fn(),
  fromMock: vi.fn(),
  rpcMock: vi.fn(),
  selectMock: vi.fn(),
  eqMock: vi.fn(),
  maybeSingleMock: vi.fn(),
  singleMock: vi.fn(),
}));

vi.mock("@/features/auth/lib/auth", () => ({
  createSupabaseServerClient: createSupabaseServerClientMock,
}));

describe("consent actions", () => {
  beforeEach(() => {
    createSupabaseServerClientMock.mockReset();
    getUserMock.mockReset();
    fromMock.mockReset();
    rpcMock.mockReset();
    selectMock.mockReset();
    eqMock.mockReset();
    maybeSingleMock.mockReset();
    singleMock.mockReset();

    eqMock.mockReturnThis();
    selectMock.mockReturnValue({ eq: eqMock });
    fromMock.mockReturnValue({ select: selectMock });
    rpcMock.mockReturnValue({ single: singleMock });
    createSupabaseServerClientMock.mockResolvedValue({
      auth: {
        getUser: getUserMock,
      },
      from: fromMock,
      rpc: rpcMock,
    });
  });

  it("returns a genuine signed-out consent status", async () => {
    getUserMock.mockResolvedValue({
      data: { user: null },
      error: new AuthSessionMissingError(),
    });
    const { getCurrentConsentStatus } = await import("./actions");

    await expect(getCurrentConsentStatus()).resolves.toEqual({
      isAuthenticated: false,
      hasAcceptedCurrentVersion: false,
      acceptedAt: null,
    });
    expect(fromMock).not.toHaveBeenCalled();
  });

  it("fails closed when auth verification returns an error", async () => {
    getUserMock.mockResolvedValue({ data: { user: null }, error: new Error("invalid session") });
    const { getCurrentConsentStatus } = await import("./actions");

    await expect(getCurrentConsentStatus()).rejects.toThrow("invalid session");
    expect(fromMock).not.toHaveBeenCalled();
  });

  it("returns authenticated current consent filtered by user and version", async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: "user-1" } }, error: null });
    maybeSingleMock.mockResolvedValue({
      data: {
        version: CONSENT_VERSION,
        accepted_at: "2026-07-16T12:00:00.000Z",
      },
      error: null,
    });
    eqMock.mockReturnValue({ eq: eqMock, maybeSingle: maybeSingleMock });
    const { getCurrentConsentStatus } = await import("./actions");

    await expect(getCurrentConsentStatus()).resolves.toEqual({
      isAuthenticated: true,
      hasAcceptedCurrentVersion: true,
      acceptedAt: "2026-07-16T12:00:00.000Z",
    });
    expect(fromMock).toHaveBeenCalledWith("user_consents");
    expect(eqMock).toHaveBeenCalledWith("user_id", "user-1");
    expect(eqMock).toHaveBeenCalledWith("version", CONSENT_VERSION);
  });

  it("throws when the authenticated consent query fails", async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: "user-1" } }, error: null });
    maybeSingleMock.mockResolvedValue({ data: null, error: new Error("query failed") });
    eqMock.mockReturnValue({ eq: eqMock, maybeSingle: maybeSingleMock });
    const { getCurrentConsentStatus } = await import("./actions");

    await expect(getCurrentConsentStatus()).rejects.toThrow("query failed");
  });

  it("throws when RPC acceptance fails", async () => {
    singleMock.mockResolvedValue({ data: null, error: new Error("rpc failed") });
    const { acceptCurrentConsent } = await import("./actions");

    await expect(acceptCurrentConsent()).rejects.toThrow("rpc failed");
    expect(rpcMock).toHaveBeenCalledWith("accept_current_user_consent", {
      consent_version: CONSENT_VERSION,
    });
  });
});
