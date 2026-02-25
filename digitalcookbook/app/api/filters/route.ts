import { connectToDB } from "@/lib/connectToDB";
import Recipe from "@/models/Recipe";
import Appliance from "@/models/Appliance";
import { NextResponse } from 'next/server';
import { cookies } from "next/headers";

export async function GET(req: Request){
    const cookieStore = await cookies(); 
    
    await connectToDB(cookieStore);

    // get language option
    const url = new URL(req.url);
    const lang = url.searchParams.get("lang") == "es" ? "es" : "en";

    // fetch recipe tags and allergens
    const recipe = await Recipe.findOne().select(lang === "es" ? `espTags espAllergens` : `tags allergens`).lean() as any;

    // Get filter options from fields (id, name) - id for ordering
    const appliances = (await Appliance.find().select(`${lang} -_id`)).map((appliance, index) => ({id: index, name: appliance[lang]}));
    const tags = Object.keys(lang === "es" ? recipe?.espTags || {} : recipe?.tags || {}).map((tag, index) => ({id: index, name: tag}));
    const allergens = Object.keys(lang === "es" ? recipe?.espAllergens || {} : recipe?.allergens || {}).map((allergen, index) => ({id: index, name: allergen}));

    // return filters as array
    return NextResponse.json({appliances, tags, allergens});
}