import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PortfolioView } from "@/features/portfolio/components/portfolio-view";

vi.mock("@/features/portfolio/lib/actions", () => ({ addPortfolioPosition: vi.fn(), deletePortfolioPosition: vi.fn() }));

const positions = [
  { id: "123e4567-e89b-42d3-a456-426614174000", symbol: "AAPL", quantity: 2, averageCost: 100, currency: "USD", createdAt: "2026-07-20T00:00:00Z" },
  { id: "123e4567-e89b-42d3-a456-426614174001", symbol: "SAP", quantity: 3, averageCost: 50, currency: "EUR", createdAt: "2026-07-20T00:00:00Z" },
];

describe("PortfolioView", () => {
  it("renders positions and separates cost basis totals by currency", () => {
    render(<PortfolioView positions={positions} />);
    expect(screen.getByRole("table", { name: "Manually entered portfolio positions" })).toBeTruthy();
    expect(screen.getByText("Cost basis (USD)")).toBeTruthy();
    expect(screen.getByText("Cost basis (EUR)")).toBeTruthy();
    expect(screen.getByText(/not live market value/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Delete AAPL position" })).toBeTruthy();
  });

  it("renders an accessible empty state", () => {
    render(<PortfolioView positions={[]} />);
    expect(screen.getByRole("heading", { name: "No positions yet" })).toBeTruthy();
  });

  it("renders an accessible provider error", () => {
    render(<PortfolioView positions={[]} error="Portfolio positions could not be loaded." />);
    expect(screen.getByRole("alert")).toBeTruthy();
  });
});
