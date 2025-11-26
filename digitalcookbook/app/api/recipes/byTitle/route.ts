import { connectToDB } from "@/lib/connectToDB";
import Recipe from "@/models/models/Recipe";
import Ingredient from "@/models/models/Ingredient";
import Appliance from "@/models/models/Appliance";
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
    const recipies = await Recipe.find(filter).populate("ingredients.ingredient").populate("appliances");
    return NextResponse.json(recipies);
}