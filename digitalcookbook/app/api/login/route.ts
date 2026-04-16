import { NextResponse } from "next/server";
import { encrypt } from "@/lib/session";
import User from "@/models/User";
import { connectToDB } from "@/lib/connectToDB";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  await connectToDB();

  const validUser = await User.findOne({ email });

  if (!validUser) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  // Compare hashed password
  const passwordMatch = await bcrypt.compare(password, validUser.password);

  if (!passwordMatch) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  // Create encrypted session cookie
  const sessionData = { email };
  const encrypted = await encrypt(sessionData);

  const res = NextResponse.json({ success: true });

  const cookieStore = await cookies(); 
  cookieStore.set("session", encrypted)
  /*res.cookies.set("session", encrypted, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 2,
    path: "/",
  });
*/
  return res;
}


