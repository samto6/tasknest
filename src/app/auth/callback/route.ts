import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  // If no code provided, redirect to login immediately
  if (!code) {
    console.error("[Auth Callback] No code parameter provided");
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("error", "missing_code");
    return NextResponse.redirect(loginUrl);
  }

  console.log("[Auth Callback] Processing magic link code");

  // Create response first - we'll attach cookies to it
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options) {
          try {
            response.cookies.set({
              name,
              value,
              ...options,
              sameSite: "lax",
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
            });
          } catch (error) {
            console.error("[Auth Callback] Failed to set cookie:", name, error);
          }
        },
        remove(name: string, options) {
          try {
            response.cookies.set({
              name,
              value: "",
              ...options,
              maxAge: 0,
            });
          } catch (error) {
            console.error("[Auth Callback] Failed to remove cookie:", name, error);
          }
        },
      },
    }
  );

  // Exchange code for session
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  // Determine redirect destination based on result
  if (error || !data.session) {
    // If code exchange failed, redirect to login with error
    console.error("[Auth Callback] Code exchange failed:", error?.message || "No session returned");
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("error", "authentication_failed");
    return NextResponse.redirect(redirectUrl);
  }

  // Success - log and redirect to dashboard
  console.log("[Auth Callback] Authentication successful, redirecting to dashboard");
  const redirectUrl = new URL("/dashboard", req.url);

  // Create new redirect response and copy cookies from the original response
  const redirectResponse = NextResponse.redirect(redirectUrl);

  // Copy all cookies from the response to the redirect response
  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });

  return redirectResponse;
}
