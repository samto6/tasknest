import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  // If no code provided, redirect to login immediately
  if (!code) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("error", "missing_code");
    return NextResponse.redirect(loginUrl);
  }

  // Store cookies in an array to apply later
  const cookiesToSet: string[] = [];

  // Serialize cookies manually to avoid Next.js base64 wrapping, which
  // breaks Supabase's JSON parsing in the browser helper.
  function serializeCookie(
    name: string,
    value: string,
    options: CookieOptions = {}
  ) {
    const segments: string[] = [];
    // Encode value to be cookie-safe; Supabase expects to JSON.parse after decode
    const encoded = encodeURIComponent(value);
    segments.push(`${name}=${encoded}`);
    if (options.maxAge !== undefined) segments.push(`Max-Age=${options.maxAge}`);
    if (options.expires) segments.push(`Expires=${new Date(options.expires).toUTCString()}`);
    if (options.path) segments.push(`Path=${options.path}`);
    else segments.push(`Path=/`);
    if (options.domain) segments.push(`Domain=${options.domain}`);
    if (options.sameSite) {
      const ss = typeof options.sameSite === "string" ? options.sameSite : (options.sameSite === true ? "Strict" : "Lax");
      // Normalize case
      const normalized = ss.charAt(0).toUpperCase() + ss.slice(1).toLowerCase();
      segments.push(`SameSite=${normalized}`);
    }
    if (options.secure) segments.push("Secure");
    if (options.httpOnly) segments.push("HttpOnly");
    return segments.join("; ");
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookiesToSet.push(serializeCookie(name, value, options));
          } catch {
            // Silently fail if cookies cannot be set
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookiesToSet.push(serializeCookie(name, "", { ...options, maxAge: 0, expires: new Date(0) }));
          } catch {
            // Silently fail if cookies cannot be removed
          }
        },
      },
    }
  );

  // Exchange code for session
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  // Determine redirect destination based on result
  let redirectUrl: URL;
  if (error || !data.session) {
    // If code exchange failed, redirect to login with error
    console.error("Auth callback error:", error);
    redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("error", "authentication_failed");
  } else {
    // Success - redirect to dashboard
    redirectUrl = new URL("/dashboard", req.url);
  }

  // Create redirect response and apply all cookies
  const res = NextResponse.redirect(redirectUrl);
  cookiesToSet.forEach(cookie => {
    res.headers.append("Set-Cookie", cookie);
  });

  return res;
}
