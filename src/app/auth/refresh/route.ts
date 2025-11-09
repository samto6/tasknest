import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: NextRequest) {
  let response = NextResponse.json({ success: true });

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
            console.error("[Auth Refresh] Failed to set cookie:", name, error);
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
            console.error("[Auth Refresh] Failed to remove cookie:", name, error);
          }
        },
      },
    }
  );

  try {
    // Attempt to refresh the session
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      console.error("[Auth Refresh] Failed to refresh session:", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }

    console.log("[Auth Refresh] Session refreshed successfully");
    return response;
  } catch (error) {
    console.error("[Auth Refresh] Unexpected error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
