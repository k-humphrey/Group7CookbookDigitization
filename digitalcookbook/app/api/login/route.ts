import { NextResponse } from "next/server";
import { encrypt } from "@/lib/session";
import User from "@/models/User";
import { connectToDB } from "@/lib/connectToDB";

export async function POST(req: Request) {
    //get username and password
    const { username, password } = await req.json();
    //connect to db
    await connectToDB();
    //check authentication
    const validUser = await User.findOne({email : username});
    //if not authenticated, return invalid credentials
    if (!validUser || validUser.password !== password) {
        return NextResponse.json(
            { error: "Invalid credentials" },
            { status: 401 }
        );
    }

    /*To create our Session ID, we want to encrypt some personal identifier 
    Username is good here, maybe not password because that's a potential leak of more important identification
    encrypt function is in lib. It takes a secret token from .env and uses that to encrypt the username. */
    const sessionData = { username };
    const encrypted = await encrypt(sessionData);

    //create response
    const res = NextResponse.json({ success: true });

    //set the encrypted username as a cookie, expires in 2 hours
    res.cookies.set("session", encrypted, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 2, // 2 hours
        path: "/",
    });
    
    //return the result :)
    return res;
}
