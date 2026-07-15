"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signInAction, signUpAction, resetPasswordAction } from "@/features/auth/lib/actions";

const authLinkMessages: Record<string, string> = {
  invalid: "This sign-in link is invalid or has already been used.",
  expired: "This sign-in link has expired. Request a new link to continue.",
};

interface AuthFormProps {
  mode: "sign-in" | "sign-up" | "forgot-password";
}

export function AuthForm({ mode }: AuthFormProps) {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const next = searchParams.get("next");
  const passwordStatus = searchParams.get("password");
  const authLinkError = searchParams.get("error");

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (mode === "sign-in") {
        await signInAction(formData);
      } else if (mode === "sign-up") {
        await signUpAction(formData);
      } else {
        await resetPasswordAction(formData);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-4 rounded-3xl border border-zinc-800 bg-zinc-950/90 p-6 shadow-2xl shadow-black/30">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-zinc-100">
          {mode === "sign-in" && "Sign in"}
          {mode === "sign-up" && "Create your account"}
          {mode === "forgot-password" && "Reset your password"}
        </h1>
        <p className="text-sm leading-6 text-zinc-400">
          {mode === "forgot-password"
            ? "Enter your email to receive a password reset link."
            : "Use this secure form to continue to your workspace."}
        </p>
      </div>

      {mode === "sign-up" ? (
        <label className="block text-sm text-zinc-300">
          <span className="mb-2 block">Display name</span>
          <input name="displayName" className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100" />
        </label>
      ) : null}

      {mode === "sign-in" && next?.startsWith("/") && !next.startsWith("//") ? <input type="hidden" name="next" value={next} /> : null}

      <label className="block text-sm text-zinc-300">
        <span className="mb-2 block">Email</span>
        <input type="email" name="email" required className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100" />
      </label>

      {mode !== "forgot-password" ? (
        <label className="block text-sm text-zinc-300">
          <span className="mb-2 block">Password</span>
          <input type="password" name="password" required className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100" />
        </label>
      ) : null}

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}
      {mode === "sign-in" && authLinkError ? (
        <p className="text-sm text-rose-400">{authLinkMessages[authLinkError] ?? authLinkMessages.invalid}</p>
      ) : null}
      {mode === "sign-in" && passwordStatus === "updated" ? (
        <p className="text-sm text-emerald-400">Password updated. Sign in with your new password.</p>
      ) : null}

      <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-950 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400">
        {isSubmitting ? "Working..." : mode === "forgot-password" ? "Send reset link" : mode === "sign-up" ? "Create account" : "Sign in"}
      </button>

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-zinc-400">
        {mode === "sign-in" ? (
          <Link href="/forgot-password" className="text-zinc-300 underline underline-offset-4">
            Forgot password?
          </Link>
        ) : null}
        {mode !== "sign-up" ? (
          <Link href="/sign-up" className="text-zinc-300 underline underline-offset-4">
            Create an account
          </Link>
        ) : null}
        {mode !== "sign-in" ? (
          <Link href="/sign-in" className="text-zinc-300 underline underline-offset-4">
            Back to sign in
          </Link>
        ) : null}
      </div>
    </form>
  );
}
