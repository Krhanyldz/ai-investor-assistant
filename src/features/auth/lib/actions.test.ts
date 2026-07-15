import { beforeEach, describe, expect, it, vi } from "vitest";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const { createSupabaseServerClientMock, signOutMock, signInWithPasswordMock, updateUserMock } = vi.hoisted(() => ({
  createSupabaseServerClientMock: vi.fn(),
  signOutMock: vi.fn(),
  signInWithPasswordMock: vi.fn(),
  updateUserMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/features/auth/lib/auth", () => ({
  createSupabaseServerClient: createSupabaseServerClientMock,
}));

describe("auth actions", () => {
  beforeEach(() => {
    createSupabaseServerClientMock.mockReset();
    signOutMock.mockReset();
    signInWithPasswordMock.mockReset();
    updateUserMock.mockReset();
    vi.mocked(redirect).mockReset();
    vi.mocked(revalidatePath).mockReset();
    createSupabaseServerClientMock.mockResolvedValue({
      auth: {
        signOut: signOutMock,
        signInWithPassword: signInWithPasswordMock,
        updateUser: updateUserMock,
      },
    });
  });

  it("signs out, revalidates the workspace, and redirects to sign in", async () => {
    signOutMock.mockResolvedValue({ error: null });
    const { signOutAction } = await import("./actions");

    await signOutAction();

    expect(signOutMock).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith("/");
    expect(redirect).toHaveBeenCalledWith("/sign-in");
  });

  it("redirects sign-in to a safe requested route", async () => {
    signInWithPasswordMock.mockResolvedValue({ error: null });
    const { signInAction } = await import("./actions");
    const formData = new FormData();
    formData.set("email", "user@example.com");
    formData.set("password", "password");
    formData.set("next", "/portfolio");

    await signInAction(formData);

    expect(signInWithPasswordMock).toHaveBeenCalledWith({ email: "user@example.com", password: "password" });
    expect(redirect).toHaveBeenCalledWith("/portfolio");
  });

  it("rejects external sign-in return paths", async () => {
    signInWithPasswordMock.mockResolvedValue({ error: null });
    const { signInAction } = await import("./actions");
    const formData = new FormData();
    formData.set("email", "user@example.com");
    formData.set("password", "password");
    formData.set("next", "https://evil.test");

    await signInAction(formData);

    expect(redirect).toHaveBeenCalledWith("/");
  });

  it.each(["/%5Cevil.test", "//evil.test"])("rejects unsafe sign-in return path %s", async (next) => {
    signInWithPasswordMock.mockResolvedValue({ error: null });
    const { signInAction } = await import("./actions");
    const formData = new FormData();
    formData.set("email", "user@example.com");
    formData.set("password", "password");
    formData.set("next", next);

    await signInAction(formData);

    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("updates the password, signs out, revalidates root, and redirects to sign in", async () => {
    updateUserMock.mockResolvedValue({ error: null });
    signOutMock.mockResolvedValue({ error: null });
    const { updatePasswordAction } = await import("./actions");
    const formData = new FormData();
    formData.set("password", "new-password");

    await updatePasswordAction(formData);

    expect(updateUserMock).toHaveBeenCalledWith({ password: "new-password" });
    expect(signOutMock).toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith("/");
    expect(redirect).toHaveBeenCalledWith("/sign-in?password=updated");
  });

  it("does not sign out or redirect when password update fails", async () => {
    updateUserMock.mockResolvedValue({ error: new Error("weak password") });
    const { updatePasswordAction } = await import("./actions");
    const formData = new FormData();
    formData.set("password", "bad");

    await expect(updatePasswordAction(formData)).rejects.toThrow("weak password");

    expect(signOutMock).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });
});
