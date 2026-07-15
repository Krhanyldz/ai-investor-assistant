import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const protectedRoutes = ["/", "/dashboard", "/stocks", "/etfs", "/watchlist", "/portfolio", "/ai-research", "/settings"];

function isProtectedRoute(pathname: string) {
  return protectedRoutes.some((route) => pathname === route || (route !== "/" && pathname.startsWith(`${route}/`)));
}

function getSignInUrl(request: NextRequest) {
  const signInUrl = new URL("/sign-in", request.url);
  const next = `${request.nextUrl.pathname}${request.nextUrl.search}`;

  if (next !== "/") {
    signInUrl.searchParams.set("next", next);
  }

  return signInUrl;
}

function nextResponseWithRequestCookies(request: NextRequest) {
  return NextResponse.next({
    request: {
      headers: new Headers(request.headers),
    },
  });
}

function copyResponseCookies(source: NextResponse, destination: NextResponse) {
  source.cookies.getAll().forEach((cookie) => {
    destination.cookies.set(cookie);
  });
}

export async function proxy(request: NextRequest) {
  if (!isProtectedRoute(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (!supabaseUrl || !supabasePublishableKey) {
    return NextResponse.json({ error: "Supabase authentication is not configured." }, { status: 503 });
  }

  let response = nextResponseWithRequestCookies(request);

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = nextResponseWithRequestCookies(request);
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    const redirectResponse = NextResponse.redirect(getSignInUrl(request));
    copyResponseCookies(response, redirectResponse);
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/stocks/:path*", "/etfs/:path*", "/watchlist/:path*", "/portfolio/:path*", "/ai-research/:path*", "/settings/:path*"],
};
