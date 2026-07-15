import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/features/auth/lib/auth";
import { getSafeLocalRedirectPath } from "@/features/auth/lib/redirects";

const AUTH_ERROR_REDIRECT_PATH = "/sign-in";

function getFailureRedirectPath(requestUrl: URL, nextPath: string) {
  const targetPath = nextPath.startsWith("/reset-password") ? "/reset-password" : AUTH_ERROR_REDIRECT_PATH;
  const targetUrl = new URL(targetPath, requestUrl.origin);
  const errorCode = requestUrl.searchParams.get("error_code");

  targetUrl.searchParams.set("error", errorCode === "otp_expired" ? "expired" : "invalid");
  return targetUrl;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = getSafeLocalRedirectPath(requestUrl.searchParams.get("next"));

  if (requestUrl.searchParams.has("error")) {
    return NextResponse.redirect(getFailureRedirectPath(requestUrl, next));
  }

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  return NextResponse.redirect(getFailureRedirectPath(requestUrl, next));
}
