import { connectToDB } from "@/lib/connectToDB";
import Recipe from "@/models/Recipe";
import { NextResponse } from 'next/server';

export async function GET(req: Request){
    await connectToDB();
    
    // fetch recipe
    const recipe = await Recipe.findOne().lean() as any;

    // extract allergens
    const allergens = Object.keys(recipe?.allergens || {});
    return NextResponse.json(allergens);
}