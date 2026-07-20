import { Suspense } from "react";
import { AuthForm } from "@/features/auth/components/auth-form";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-16 text-zinc-100">
      <Suspense fallback={null}>
        <AuthForm mode="sign-in" />
      </Suspense>
    </main>
  );
}
