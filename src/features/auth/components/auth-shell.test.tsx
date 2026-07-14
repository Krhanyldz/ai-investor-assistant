import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { AuthShell } from "./auth-shell";

const getSession = vi.fn();

vi.mock("@supabase/ssr", () => ({
  createBrowserClient: () => ({
    auth: {
      getSession,
    },
  }),
}));

describe("AuthShell", () => {
  beforeEach(() => {
    getSession.mockReset();
  });

  it("renders children once the auth session is ready", async () => {
    getSession.mockResolvedValue({ data: { session: null } });

    render(
      <AuthShell>
        <div>Protected content</div>
      </AuthShell>,
    );

    await waitFor(() => {
      expect(screen.getByText("Protected content")).toBeTruthy();
    });
  });
});
