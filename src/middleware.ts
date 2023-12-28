import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const adminPath = "/manage";
  const apiAdminPath = "/api/admin";

  const res = NextResponse.next();
  const supabase = createMiddlewareClient(
    { req, res },
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_KEY as string,
    }
  );
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    if (req.nextUrl.pathname.startsWith(apiAdminPath)) {
      return new NextResponse(
        JSON.stringify({ message: "authorization failed" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }
    // else if (req.nextUrl.pathname.startsWith(adminPath)) {
    //   const redirectUrl = req.nextUrl.clone();
    //   redirectUrl.pathname = "/";
    //   return NextResponse.redirect(redirectUrl);
    // }
  }
}
