import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { exchangeCodeForSessionMock } = vi.hoisted(() => ({
  exchangeCodeForSessionMock: vi.fn(),
}));

vi.mock("@/features/auth/lib/auth", () => ({
  createSupabaseServerClient: async () => ({
    auth: {
      exchangeCodeForSession: exchangeCodeForSessionMock,
    },
  }),
}));

describe("/auth/callback", () => {
  beforeEach(() => {
    exchangeCodeForSessionMock.mockReset();
  });

  it("exchanges an authorization code and redirects to a safe next path", async () => {
    exchangeCodeForSessionMock.mockResolvedValue({ error: null });
    const { GET } = await import("./route");

    const response = await GET(new NextRequest("https://app.test/auth/callback?code=abc&next=/stocks"));

    expect(exchangeCodeForSessionMock).toHaveBeenCalledWith("abc");
    expect(response.headers.get("location")).toBe("https://app.test/stocks");
  });

  it("falls back to the dashboard when next is external", async () => {
    exchangeCodeForSessionMock.mockResolvedValue({ error: null });
    const { GET } = await import("./route");

    const response = await GET(new NextRequest("https://app.test/auth/callback?code=abc&next=https://evil.test"));

    expect(response.headers.get("location")).toBe("https://app.test/");
  });

  it.each(["/%5Cevil.test", "//evil.test"])("falls back to the dashboard when next is unsafe: %s", async (next) => {
    exchangeCodeForSessionMock.mockResolvedValue({ error: null });
    const { GET } = await import("./route");

    const response = await GET(new NextRequest(`https://app.test/auth/callback?code=abc&next=${next}`));

    expect(response.headers.get("location")).toBe("https://app.test/");
  });

  it("redirects invalid recovery links to a safe reset-password state", async () => {
    exchangeCodeForSessionMock.mockResolvedValue({ error: new Error("invalid") });
    const { GET } = await import("./route");

    const response = await GET(new NextRequest("https://app.test/auth/callback?code=bad&next=/reset-password"));

    expect(response.headers.get("location")).toBe("https://app.test/reset-password?error=invalid");
  });

  it("redirects expired Supabase links to an expired state", async () => {
    const { GET } = await import("./route");

    const response = await GET(new NextRequest("https://app.test/auth/callback?error=access_denied&error_code=otp_expired&next=/reset-password"));

    expect(exchangeCodeForSessionMock).not.toHaveBeenCalled();
    expect(response.headers.get("location")).toBe("https://app.test/reset-password?error=expired");
  });
});
