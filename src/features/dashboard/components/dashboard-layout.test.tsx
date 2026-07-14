import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardLayout } from "./dashboard-layout";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("DashboardLayout", () => {
  it("renders the title and demo data label", () => {
    render(<DashboardLayout title="Dashboard" description="Demo shell" />);

    expect(screen.getByRole("heading", { level: 1, name: "Dashboard" })).toBeTruthy();
    expect(screen.getByText("Demo / sample data")).toBeTruthy();
  });
});
