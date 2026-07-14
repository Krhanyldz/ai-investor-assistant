import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { DashboardLayout } from "./dashboard-layout";
import { DashboardLayoutContent } from "./dashboard-layout-content";

const signOut = vi.fn();
const replace = vi.fn();
const refresh = vi.fn();
let currentPathname = "/";

vi.mock("next/navigation", () => ({
  usePathname: () => currentPathname,
  useRouter: () => ({ replace, refresh }),
}));

const getUser = vi.fn();

vi.mock("@/features/auth/lib/auth", () => ({
  createSupabaseServerClient: vi.fn(async () => ({
    auth: {
      getUser,
    },
  })),
}));

vi.mock("@supabase/ssr", () => ({
  createBrowserClient: () => ({
    auth: {
      signOut,
    },
  }),
}));

describe("DashboardLayoutContent", () => {
  beforeEach(() => {
    currentPathname = "/";
    signOut.mockReset();
    replace.mockReset();
    refresh.mockReset();
    getUser.mockReset();
    signOut.mockResolvedValue({ error: null });
  });

  it("passes the authenticated user email from the server-side auth lookup", async () => {
    getUser.mockResolvedValue({ data: { user: { email: "server@example.com" } }, error: null });

    const component = await DashboardLayout({ title: "Dashboard", description: "Demo shell" });
    render(component);

    expect(screen.getByText("server@example.com")).toBeTruthy();
  });

  it("renders the title, demo data label, and the signed-in user email", () => {
    render(
      <DashboardLayoutContent title="Dashboard" description="Demo shell" userEmail="investor@example.com">
        <div>Body content</div>
      </DashboardLayoutContent>,
    );

    expect(screen.getByRole("heading", { level: 1, name: "Dashboard" })).toBeTruthy();
    expect(screen.getByText("Demo / sample data")).toBeTruthy();
    expect(screen.getByText("investor@example.com")).toBeTruthy();
  });

  it("signs the user out and clears the session state", async () => {
    render(
      <DashboardLayoutContent title="Dashboard" description="Demo shell" userEmail="investor@example.com">
        <div>Body content</div>
      </DashboardLayoutContent>,
    );

    fireEvent.click(screen.getByRole("button", { name: /sign out/i }));

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledTimes(1);
    });
  });

  it("redirects to sign-in after a successful sign-out", async () => {
    render(
      <DashboardLayoutContent title="Dashboard" description="Demo shell" userEmail="investor@example.com">
        <div>Body content</div>
      </DashboardLayoutContent>,
    );

    fireEvent.click(screen.getByRole("button", { name: /sign out/i }));

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith("/sign-in");
      expect(refresh).toHaveBeenCalled();
    });
  });

  it.each([
    ["/", "Dashboard"],
    ["/dashboard", "Dashboard"],
    ["/stocks", "Stocks"],
    ["/etfs", "ETFs"],
    ["/watchlist", "Watchlist"],
    ["/portfolio", "Portfolio"],
    ["/ai-research", "AI Research"],
    ["/settings", "Settings"],
  ])("highlights the correct nav item for %s", (pathname, expectedLabel) => {
    currentPathname = pathname;

    const { container } = render(
      <DashboardLayoutContent title="Dashboard" description="Demo shell" userEmail="investor@example.com">
        <div>Body content</div>
      </DashboardLayoutContent>,
    );

    const link = container.querySelector(`a[href="${pathname === "/dashboard" ? "/" : pathname}"]`);
    expect(link?.getAttribute("aria-current")).toBe("page");
    expect(link?.textContent).toContain(expectedLabel);
  });
});
