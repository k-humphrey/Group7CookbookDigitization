import { connectToDB } from "@/lib/connectToDB";
import Recipe from "@/models/Recipe";
import Ingredient from "@/models/Ingredient";
import Appliance from "@/models/Appliance";
import { NextResponse } from 'next/server';

export async function GET(req: Request){
    await connectToDB();

    // Get search parameters
    const url = new URL(req.url);
    const allergenTags = url.searchParams.get("allergenTags") || null;

    let filter: any = {};

    if(allergenTags) {
        // Parse tags
        const allergenTagsList = allergenTags.split(",").map(tag => tag.trim());

        // match if tag is true
        allergenTagsList.forEach(tag => {
            filter[`tags.${tag}`] = true;
        });
    }
    
    // return matched recipes
    const recipies = await Recipe.find(filter)
        .populate({ path: "appliances", model: Appliance })
        .populate({ path: "ingredients.ingredient", model: Ingredient });
    return NextResponse.json(recipies);
}