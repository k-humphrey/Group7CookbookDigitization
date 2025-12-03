import { connectToDB } from "@/lib/connectToDB";
import Ingredient from "@/models/models/Ingredient";
import { NextResponse } from 'next/server';

export async function GET(req: Request){
    await connectToDB();
    const ingredients = await Ingredient.find({});
    return NextResponse.json(Ingredient);
}