import { connectToDB } from "@/lib/connectToDB";
import Ingredient from "@/models/Ingredient";
import { NextResponse } from 'next/server';
import { cookies } from "next/headers";

export async function GET(req: Request){
    const cookieStore = await cookies(); 

    await connectToDB(cookieStore);
    const ingredients = await Ingredient.find({});
    return NextResponse.json(ingredients);
}