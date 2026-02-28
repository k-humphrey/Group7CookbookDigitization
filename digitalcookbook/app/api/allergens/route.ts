import { connectToDB } from "@/lib/connectToDB";
import Recipe from "@/models/Recipe";
import { NextResponse } from 'next/server';

export async function GET(req: Request){
    await connectToDB();

    // get language option
    const url = new URL(req.url);
    const lang = url.searchParams.get("lang") == "es" ? "es" : "en";
    
    // fetch recipe
    const recipe = await Recipe.findOne().lean() as any;

    // extract allergens
    const allergens = Object.keys(lang == "es" ? recipe?.espAllergens : recipe?.allergens || {});
    return NextResponse.json(allergens);
}