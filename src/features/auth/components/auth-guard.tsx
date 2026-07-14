import { redirect } from "next/navigation";
import { requireAuthenticatedUser } from "@/features/auth/lib/auth";

interface AuthGuardProps {
  children: React.ReactNode;
}

export async function AuthGuard({ children }: AuthGuardProps) {
  const user = await requireAuthenticatedUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <>{children}</>;
}
