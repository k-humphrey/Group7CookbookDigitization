import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.redirect("/");

  res.cookies.set("session", "", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  console.log("please")

  return res;
}