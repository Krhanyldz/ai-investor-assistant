import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { DashboardLayout } from "./dashboard-layout";
import { DashboardLayoutContent } from "./dashboard-layout-content";

let currentPathname = "/";

vi.mock("next/navigation", () => ({
  usePathname: () => currentPathname,
}));

describe("DashboardLayoutContent", () => {
  beforeEach(() => {
    currentPathname = "/";
  });

  it("renders the title, demo labels, market strip, and page content without auth UI", () => {
    render(
      <DashboardLayoutContent title="Dashboard" description="Demo shell">
        <div>Body content</div>
      </DashboardLayoutContent>,
    );

    expect(screen.getByRole("heading", { level: 1, name: "Dashboard" })).toBeTruthy();
    expect(screen.getByText("Demo / sample data")).toBeTruthy();
    expect(screen.getByText("Top market strip - sample data")).toBeTruthy();
    expect(screen.getByText("Sample data only. No authentication, APIs, or charts are connected.")).toBeTruthy();
    expect(screen.queryByRole("button", { name: /sign out/i })).toBeNull();
    expect(screen.getByText("Body content")).toBeTruthy();
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
      <DashboardLayoutContent title="Dashboard" description="Demo shell">
        <div>Body content</div>
      </DashboardLayoutContent>,
    );

    const link = container.querySelector(`a[href="${pathname === "/dashboard" ? "/" : pathname}"]`);
    expect(link?.getAttribute("aria-current")).toBe("page");
    expect(link?.textContent).toContain(expectedLabel);
  });

  it("opens and closes the mobile drawer", () => {
    render(
      <DashboardLayoutContent title="Dashboard" description="Demo shell">
        <div>Body content</div>
      </DashboardLayoutContent>,
    );

    const menuButton = screen.getByRole("button", { name: /open navigation menu/i });
    const drawer = screen.getByRole("dialog", { name: /mobile navigation/i });

    expect(menuButton.getAttribute("aria-expanded")).toBe("false");
    expect(drawer.className).toContain("-translate-x-full");

    fireEvent.click(menuButton);

    expect(menuButton.getAttribute("aria-expanded")).toBe("true");
    expect(drawer.className).toContain("translate-x-0");

    fireEvent.click(screen.getByRole("button", { name: /close navigation menu/i }));

    expect(menuButton.getAttribute("aria-expanded")).toBe("false");
    expect(drawer.className).toContain("-translate-x-full");
  });

  it("renders children through DashboardLayout", () => {
    render(
      <DashboardLayout title="Dashboard" description="Demo shell">
        <div>Shell body</div>
      </DashboardLayout>,
    );

    expect(screen.getByRole("heading", { level: 1, name: "Dashboard" })).toBeTruthy();
    expect(screen.getByText("Shell body")).toBeTruthy();
  });
});
