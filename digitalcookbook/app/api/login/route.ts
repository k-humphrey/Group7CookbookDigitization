//app/api/login/route.ts

import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { username, password } = await req.json();

    const admins = [
        {
        username: process.env.ADMIN_USER1,
        password: process.env.ADMIN_PASS1,
        },
        {
        username: process.env.ADMIN_USER2,
        password: process.env.ADMIN_PASS2,
        },
    ];

    const validUser = admins.find (
        (admin) =>
        admin.username === username && admin.password === password
    );

    if (!validUser) {
        return NextResponse.json (
        { error: "Invalid credentials" },
        { status: 401 }
        );
    }

    // Create response + set cookie
    const res = NextResponse.json({ success: true });

    res.cookies.set("admin-auth", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
    });

    return res;
}
