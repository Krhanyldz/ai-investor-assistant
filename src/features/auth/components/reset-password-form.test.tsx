import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ResetPasswordForm } from "./reset-password-form";

let currentSearchParams = new URLSearchParams();

const { updatePasswordActionMock } = vi.hoisted(() => ({
  updatePasswordActionMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => currentSearchParams,
}));

vi.mock("@/features/auth/lib/actions", () => ({
  updatePasswordAction: updatePasswordActionMock,
}));

describe("ResetPasswordForm", () => {
  beforeEach(() => {
    currentSearchParams = new URLSearchParams();
    updatePasswordActionMock.mockReset();
  });

  it("updates a password through the recovery session", async () => {
    updatePasswordActionMock.mockResolvedValue(undefined);

    render(<ResetPasswordForm />);

    fireEvent.change(screen.getByLabelText(/new password/i), { target: { value: "new-password" } });
    fireEvent.click(screen.getByRole("button", { name: /update password/i }));

    await waitFor(() => {
      expect(updatePasswordActionMock).toHaveBeenCalled();
    });
  });

  it("shows an expired-link state without rendering the password form", () => {
    currentSearchParams = new URLSearchParams("error=expired");

    render(<ResetPasswordForm />);

    expect(screen.getByText("This reset link has expired. Request a new password reset link to continue.")).toBeTruthy();
    expect(screen.queryByLabelText(/new password/i)).toBeNull();
    expect(screen.getByRole("link", { name: /request a new link/i }).getAttribute("href")).toBe("/forgot-password");
  });

  it("shows an invalid-link state without rendering the password form", () => {
    currentSearchParams = new URLSearchParams("error=invalid");

    render(<ResetPasswordForm />);

    expect(screen.getByText("This reset link is invalid or has already been used. Request a new password reset link to continue.")).toBeTruthy();
    expect(screen.queryByRole("button", { name: /update password/i })).toBeNull();
  });
});
