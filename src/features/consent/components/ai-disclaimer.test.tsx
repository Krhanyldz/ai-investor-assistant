import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AIDisclaimer } from "./ai-disclaimer";

describe("AIDisclaimer", () => {
  it("renders under AI-generated output", () => {
    render(
      <div>
        <p>AI analysis preview</p>
        <AIDisclaimer />
      </div>,
    );

    expect(screen.getByText(/AI analysis preview/i)).toBeTruthy();
    expect(screen.getByText(/AI disclaimer/i)).toBeTruthy();
  });
});
