import { connectToDB } from "@/lib/connectToDB";
import Recipe from "@/models/models/Recipe";
import Ingredient from "@/models/models/Ingredient";
import Appliance from "@/models/models/Appliance";
import { NextResponse } from 'next/server';

export async function GET(req: Request){
    await connectToDB();

    // Get url
    const url = new URL(req.url);

    // Get search parameters from url if available
    const appliancesParams = url.searchParams.get("appliances") || null;
    const ingredientsParams = url.searchParams.get("ingredients") || null;
    const tagsParams = url.searchParams.get("tags") || null;
    const titleParam = url.searchParams.get("title") || null;

    const filters: any[] = [];

    // ---------- Filter by title
    if(titleParam) {
        filters.push({$or: [
            {"title.en": {$regex: titleParam, $options: 'i'}},
            {"title.es": {$regex: titleParam, $options: 'i'}},
        ]});
    }

    // ---------- Filter by ingredients
    if(ingredientsParams) {
        // Convert ingredients array into string so regex can be used
        const ingredientList = ingredientsParams.split(",").map(ingredient => ingredient.trim()).flatMap(ingredient => [
            {"en": {$regex: ingredient, $options: 'i'}},
            {"es": {$regex: ingredient, $options: 'i'}},
        ]);

        // Connect to the ingredients database and find matching ingredients ids
        const matchingIngredients = await Ingredient.find({"$or": ingredientList}).select('_id');
        
        // Add to filters
        if(matchingIngredients.length > 0) {
            const ingredientIds = matchingIngredients.map(ingredient => ingredient._id);
            filters.push({"ingredients.ingredient": {$in: ingredientIds}});
        }
    }   

    // ---------- Filter by appliances
    if(appliancesParams) {
        // Convert appliances array into string so regex can be used
        const appliancesList = appliancesParams.split(",").map(appliance => appliance.trim()).flatMap(appliance => [
            {"en": {$regex: appliance, $options: 'i'}},
            {"es": {$regex: appliance, $options: 'i'}},
        ]);

        // Connect to the appliances database and find matching appliances ids
        const matchingAppliances = await Appliance.find({"$or": appliancesList}).select('_id');

        // Add to filters
        if(matchingAppliances.length > 0) {
            const appliancesIds = matchingAppliances.map(appliance => appliance._id);
            filters.push({appliances: {$in: appliancesIds}});
        }
    }

    // ---------- Filter by tags
    if(tagsParams) {
        const tagsList = tagsParams.split(",").map(tag => tag.trim());

        // match if tag is true
        tagsList.forEach(tag => {
            filters.push({[`tags.${tag}`]: true});
        });
    }

    // return matched recipes
    if(filters.length != 0) {
        const recipes = await Recipe.find({$and: filters})
        .populate({ path: "appliances", model: Appliance })
        .populate({ path: "ingredients.ingredient", model: Ingredient });

        return NextResponse.json(recipes);
    } else
        return NextResponse.json({message: "0 recipes matching the description"});

}