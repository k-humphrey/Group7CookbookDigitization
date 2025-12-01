import { connectToDB } from "@/lib/connectToDB";
import Recipe from "@/models/models/Recipe";
import Ingredient from "@/models/models/Ingredient";
import Appliance from "@/models/models/Appliance";
import { NextResponse } from 'next/server';

export async function GET(req: Request){
    await connectToDB();

    // Get search parameters
    const url = new URL(req.url);
    const tags = url.searchParams.get("tags") || null;

    let filter: any = {};

    if(tags) {
        // Parse tags
        const tagsList = tags.split(",").map(tag => tag.trim());

        // match if tag is true
        tagsList.forEach(tag => {
            filter[`tags.${tag}`] = true;
        });
    }
    
    // return matched recipes
    const recipies = await Recipe.find(filter)
        .populate({ path: "appliances", model: Appliance })
        .populate({ path: "ingredients.ingredient", model: Ingredient });
    return NextResponse.json(recipies);
}