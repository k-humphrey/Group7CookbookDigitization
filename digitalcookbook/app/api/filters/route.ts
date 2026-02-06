import { connectToDB } from "@/lib/connectToDB";
import Recipe from "@/models/Recipe";
import Appliance from "@/models/Appliance";
import { NextResponse } from 'next/server';

export async function GET(req: Request){
    await connectToDB();

    // get language option
    const url = new URL(req.url);
    const lang = url.searchParams.get("lang") == "es" ? "es" : "en";

    // fetch recipe
    const recipe = await Recipe.findOne().lean() as any;

    // Get filter options from fields
    const appliances = (await Appliance.find().select(`${lang} -_id`)).map(appliance => appliance[lang]);
    const tags = Object.keys(lang == "es" ? recipe?.espTags : recipe?.tags || {});
    const allergens = Object.keys(lang == "es" ? recipe?.espAllergens : recipe?.allergens || {});

    // return filters as array
    return NextResponse.json({appliances, tags, allergens});
}
