import { connectToDB } from "@/lib/connectToDB";
import Tag from "@/models/Tag";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();

    const tags = await Tag.find({}).sort({ en: 1 }).lean();

    return NextResponse.json(tags, { status: 200 });
  } catch (error) {
    console.error("Submitted recipe tags options API error:", error);
    return NextResponse.json([], { status: 500 });
  }
}