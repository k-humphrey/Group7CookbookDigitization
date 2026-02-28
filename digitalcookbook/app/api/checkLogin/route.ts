//this is intended to check if the user is already authenticated
import { cookies } from "next/headers";
import { isAdminAuthenticated } from "@/lib/checkAdminAuth";
import { NextResponse } from "next/server";

export async function GET(req: Request){
    const cookieStore = await cookies(); 
    if (!isAdminAuthenticated(cookieStore)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    else{
        return NextResponse.json({ success: "Authorized" }, { status: 200 });
    }
}