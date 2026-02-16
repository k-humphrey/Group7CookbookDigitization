//digitalcookbook/middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const authCookie = req.cookies.get("admin-auth");

    // Protect everything under /admin
    if (!authCookie && req.nextUrl.pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/admin-login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
