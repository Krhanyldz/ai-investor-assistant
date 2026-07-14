import { AuthForm } from "@/features/auth/components/auth-form";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-16 text-zinc-100">
      <AuthForm mode="sign-up" />
    </main>
  );
}
