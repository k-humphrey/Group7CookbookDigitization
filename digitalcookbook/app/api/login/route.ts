import { NextResponse } from "next/server";
import { encrypt } from "@/lib/session";
import User from "@/models/User";
import { connectToDB } from "@/lib/connectToDB";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  await connectToDB();

  const validUser = await User.findOne({ email });
  if (!validUser) {
    return NextResponse.json(
      { error: "Invalid credentials bc unfound" },
      { status: 401 }
    );
  }
  const role = validUser.role

  const passwordMatch = await bcrypt.compare(password, validUser.password);

  if (!passwordMatch) {
    return NextResponse.json(
      { error: "Invalid credentials bc pssword" },
      { status: 401 }
    );
  }

  const sessionData = { email, role };
  const encrypted = await encrypt(sessionData);

  const res = NextResponse.json({ success: true });
  res.cookies.set("session", encrypted, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 2,
    path: "/",
  });

  return res;
}