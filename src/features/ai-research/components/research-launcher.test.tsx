import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ResearchLauncher } from "@/features/ai-research/components/research-launcher";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

describe("ResearchLauncher", () => {
  it("normalizes the symbol and safely encodes the research question", () => {
    render(<ResearchLauncher />);
    fireEvent.change(screen.getByLabelText("Asset symbol"), { target: { value: " msft " } });
    fireEvent.change(screen.getByLabelText("Research question (optional)"), { target: { value: "Explain risks & valuation" } });
    fireEvent.submit(screen.getByRole("button", { name: "Generate research" }).closest("form")!);
    expect(push).toHaveBeenCalledWith("/ai-research/MSFT?question=Explain%20risks%20%26%20valuation");
  });
});
