"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { updatePasswordAction } from "@/features/auth/lib/actions";

const linkErrorMessages: Record<string, string> = {
  expired: "This reset link has expired. Request a new password reset link to continue.",
  invalid: "This reset link is invalid or has already been used. Request a new password reset link to continue.",
};

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const linkError = searchParams.get("error");
  const linkErrorMessage = linkError ? linkErrorMessages[linkError] ?? linkErrorMessages.invalid : null;
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await updatePasswordAction(formData);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to update your password");
      setIsSubmitting(false);
    }
  };

  return (
    <form action={handleSubmit} className="w-full max-w-md space-y-4 rounded-3xl border border-zinc-800 bg-zinc-950/90 p-6 shadow-2xl shadow-black/30">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-zinc-100">Set a new password</h1>
        <p className="text-sm leading-6 text-zinc-400">
          {linkErrorMessage ?? "Choose a new password for your account."}
        </p>
      </div>

      {linkErrorMessage ? (
        <Link href="/forgot-password" className="inline-flex w-full justify-center rounded-full bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-950">
          Request a new link
        </Link>
      ) : (
        <>
          <label className="block text-sm text-zinc-300">
            <span className="mb-2 block">New password</span>
            <input type="password" name="password" required className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100" />
          </label>

          {error ? <p className="text-sm text-rose-400">{error}</p> : null}

          <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-950 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400">
            {isSubmitting ? "Updating..." : "Update password"}
          </button>
        </>
      )}
    </form>
  );
}
