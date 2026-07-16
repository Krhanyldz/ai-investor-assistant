import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AuthForm } from "./auth-form";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/features/auth/lib/actions", () => ({
  signInAction: vi.fn(),
  signUpAction: vi.fn(),
  resetPasswordAction: vi.fn(),
}));

describe("AuthForm", () => {
  it("limits sign-up display names to the database constraint length", () => {
    render(<AuthForm mode="sign-up" />);

    expect(screen.getByLabelText(/display name/i).getAttribute("maxlength")).toBe("80");
  });
});
