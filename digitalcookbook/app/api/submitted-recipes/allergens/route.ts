import { connectToDB } from "@/lib/connectToDB";
import Allergen from "@/models/Allergen";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();

    const allergens = await Allergen.find({}).sort({ en: 1 }).lean();

    return NextResponse.json(allergens, { status: 200 });
  } catch (error) {
    console.error("Submitted recipe allergens options API error:", error);
    return NextResponse.json([], { status: 500 });
  }
}