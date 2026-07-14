"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);

    const password = String(formData.get("password") ?? "");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    );

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setIsSubmitting(false);
      return;
    }

    setSuccess(true);
    setIsSubmitting(false);
  };

  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");

  return (
    <form action={handleSubmit} className="w-full max-w-md space-y-4 rounded-3xl border border-zinc-800 bg-zinc-950/90 p-6 shadow-2xl shadow-black/30">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-zinc-100">Set a new password</h1>
        <p className="text-sm leading-6 text-zinc-400">
          {accessToken || refreshToken
            ? "Choose a new password for your account."
            : "This reset link is missing the required recovery parameters."}
        </p>
      </div>

      <label className="block text-sm text-zinc-300">
        <span className="mb-2 block">New password</span>
        <input type="password" name="password" required className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100" />
      </label>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-400">Password updated. You can now sign in.</p> : null}

      <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-950 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400">
        {isSubmitting ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}
