import { connectToDB } from "@/lib/connectToDB";
import Recipe from "@/models/models/Recipe";
import Ingredient from "@/models/models/Ingredient";
import Appliance from "@/models/models/Appliance";
import { NextResponse } from 'next/server';

export async function GET(req: Request){
    await connectToDB();

    // Get search parameters
    const url = new URL(req.url);
    const ingredientsParams = url.searchParams.get("ingredients") || null;

    let filter: any = {};
    
    if(ingredientsParams) {
        // Convert ingredients array into string so regex can be used
        const ingredientList = ingredientsParams.split(",").map(ingredient => ingredient.trim()).flatMap(ingredient => [
            {"en": {$regex: ingredient, $options: 'i'}},
            {"es": {$regex: ingredient, $options: 'i'}},
        ]);

        // Connect to the ingredients database and find matching ingredients ids
        const matchingIngredients = await Ingredient.find({"$or": ingredientList}).select('_id');
        const ingredientIds = matchingIngredients.map(ingredient => ingredient._id);

        // Create filter 
        filter["ingredients.ingredient"] = {$in: ingredientIds};

    }

    // return matched recipes
    const recipies = await Recipe.find(filter).populate("ingredients.ingredient").populate("appliances");
    return NextResponse.json(recipies);
}