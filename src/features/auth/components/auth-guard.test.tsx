import { describe, expect, it, vi, beforeEach } from "vitest";
import { redirect } from "next/navigation";
import { AuthGuard } from "./auth-guard";

const { requireAuthenticatedUserMock } = vi.hoisted(() => ({ requireAuthenticatedUserMock: vi.fn() }));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/features/auth/lib/auth", () => ({
  requireAuthenticatedUser: requireAuthenticatedUserMock,
}));

describe("AuthGuard", () => {
  beforeEach(() => {
    requireAuthenticatedUserMock.mockReset();
    vi.mocked(redirect).mockReset();
  });

  it("redirects before rendering protected content when no user is authenticated", async () => {
    requireAuthenticatedUserMock.mockResolvedValue(null);

    await AuthGuard({ children: <div>Protected content</div> });

    expect(redirect).toHaveBeenCalledWith("/sign-in");
  });

  it("renders children for authenticated users", async () => {
    requireAuthenticatedUserMock.mockResolvedValue({ email: "user@example.com" });

    const result = await AuthGuard({ children: <div>Protected content</div> });

    expect(result).toBeTruthy();
  });
});
