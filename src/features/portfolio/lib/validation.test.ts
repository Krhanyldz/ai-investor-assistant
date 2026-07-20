import { describe, expect, it } from "vitest";
import { validatePortfolioInput, validatePositionId } from "@/features/portfolio/lib/validation";

function form(values: Record<string, string>) { const data = new FormData(); Object.entries(values).forEach(([key, value]) => data.set(key, value)); return data; }

describe("portfolio validation", () => {
  it("normalizes a valid position", () => {
    expect(validatePortfolioInput(form({ symbol: " aapl ", quantity: "2.5", averageCost: "180.25", currency: "usd" }))).toEqual({ symbol: "AAPL", quantity: 2.5, averageCost: 180.25, currency: "USD" });
  });

  it.each([
    [{ symbol: "BAD!", quantity: "1", averageCost: "1", currency: "USD" }, "Symbol"],
    [{ symbol: "AAPL", quantity: "0", averageCost: "1", currency: "USD" }, "Quantity"],
    [{ symbol: "AAPL", quantity: "1", averageCost: "-2", currency: "USD" }, "Average cost"],
    [{ symbol: "AAPL", quantity: "1", averageCost: "2", currency: "US" }, "Currency"],
  ])("rejects invalid position values", (values, message) => expect(() => validatePortfolioInput(form(values))).toThrow(message));

  it("accepts only UUID position identifiers", () => {
    expect(validatePositionId("123e4567-e89b-42d3-a456-426614174000")).toBe("123e4567-e89b-42d3-a456-426614174000");
    expect(() => validatePositionId("../../other-user")).toThrow("Invalid position identifier");
  });
});
