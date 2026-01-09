import { connectToDB } from "@/lib/connectToDB";
import Recipe from "@/models/Recipe";
import Ingredient from "@/models/Ingredient";
import Appliance from "@/models/Appliance";
import { NextResponse } from 'next/server';

export async function GET(req: Request){
    await connectToDB();

    // Get search parameters
    const url = new URL(req.url);
    const searchTerm = url.searchParams.get("search") || null;

    let filter: any = {};

    if(searchTerm) {
        // create filter
        filter["$or"] = [
            {"title.en": {$regex: searchTerm, $options: 'i'}},
            {"title.es": {$regex: searchTerm, $options: 'i'}},
        ];
    }
    
    // return matched recipes
    const recipies = await Recipe.find(filter)
    .populate({ path: "appliances", model: Appliance })
    .populate({ path: "ingredients.ingredient", model: Ingredient });
    return NextResponse.json(recipies);
}