import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { createServerClientMock, getUserMock } = vi.hoisted(() => ({
  createServerClientMock: vi.fn(),
  getUserMock: vi.fn(),
}));

vi.mock("@supabase/ssr", () => ({
  createServerClient: createServerClientMock,
}));

describe("proxy", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://supabase.test";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "publishable";
    createServerClientMock.mockReset();
    getUserMock.mockReset();
    createServerClientMock.mockImplementation((_url, _key, options) => {
      options.cookies.setAll([{ name: "sb-test-auth-token", value: "refreshed", options: { path: "/" } }]);

      return {
        auth: {
          getUser: getUserMock,
        },
      };
    });
  });

  it.each(["/", "/stocks", "/etfs", "/watchlist", "/portfolio", "/ai-research", "/settings"])(
    "redirects unauthenticated access to %s",
    async (path) => {
      getUserMock.mockResolvedValue({ data: { user: null }, error: new Error("missing") });
      const { proxy } = await import("./proxy");

      const response = await proxy(new NextRequest(`https://app.test${path}`));

      expect(response.headers.get("location")).toBe(path === "/" ? "https://app.test/sign-in" : `https://app.test/sign-in?next=${encodeURIComponent(path)}`);
    },
  );

  it("preserves refreshed Supabase response cookies on unauthenticated redirects", async () => {
    getUserMock.mockResolvedValue({ data: { user: null }, error: new Error("missing") });
    const { proxy } = await import("./proxy");

    const response = await proxy(new NextRequest("https://app.test/portfolio"));

    expect(response.headers.get("location")).toBe("https://app.test/sign-in?next=%2Fportfolio");
    expect(response.cookies.get("sb-test-auth-token")?.value).toBe("refreshed");
  });

  it("allows authenticated protected routes and writes refreshed cookies", async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: "user-1" } }, error: null });
    const { proxy } = await import("./proxy");

    const response = await proxy(new NextRequest("https://app.test/portfolio"));

    expect(response.headers.get("location")).toBeNull();
    expect(response.cookies.get("sb-test-auth-token")?.value).toBe("refreshed");
  });

  it("passes refreshed request cookies to downstream routes", async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: "user-1" } }, error: null });
    const { proxy } = await import("./proxy");

    const response = await proxy(new NextRequest("https://app.test/portfolio"));

    expect(response.headers.get("x-middleware-override-headers")).toContain("cookie");
    expect(response.headers.get("x-middleware-request-cookie")).toContain("sb-test-auth-token=refreshed");
  });

  it("does not run Supabase auth for public routes", async () => {
    const { proxy } = await import("./proxy");

    const response = await proxy(new NextRequest("https://app.test/sign-in"));

    expect(createServerClientMock).not.toHaveBeenCalled();
    expect(response.headers.get("location")).toBeNull();
  });

  it("fails closed for protected routes when Supabase is not configured", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    const { proxy } = await import("./proxy");

    const response = await proxy(new NextRequest("https://app.test/portfolio"));

    expect(createServerClientMock).not.toHaveBeenCalled();
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({ error: "Supabase authentication is not configured." });
  });

  it("continues public routes when Supabase is not configured", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    const { proxy } = await import("./proxy");

    const response = await proxy(new NextRequest("https://app.test/sign-in"));

    expect(createServerClientMock).not.toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });
});
