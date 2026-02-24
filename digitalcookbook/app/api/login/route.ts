//app/api/login/route.ts

import { NextResponse } from "next/server";
import {connectToDB} from "@/lib/connectToDB";
import { cookies } from "next/headers";
import User from "@/models/User"

export async function POST(req: Request) {
    const { username, password } = await req.json();

    const cookieStore = await cookies(); 

    await connectToDB(cookieStore);

    const validUser = await User.findOne({ username });

    if (!validUser || validUser.password !== password) {
        return NextResponse.json(
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
