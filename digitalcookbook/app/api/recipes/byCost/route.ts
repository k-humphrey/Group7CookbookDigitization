import { connectToDB } from "@/lib/connectToDB";
import Recipe from "@/models/Recipe";
import Ingredient from "@/models/Ingredient";
import Appliance from "@/models/Appliance";
import { NextResponse } from 'next/server';

export async function GET(req: Request){
    await connectToDB();

    // Get search parameters
    const url = new URL(req.url);
    const maxCost = url.searchParams.get("maxCost") || null;
    const minCost = url.searchParams.get("minCost") || null;
    const order = url.searchParams.get("order") || null;

    let filter: any = {};
    let sortOrder: any = {};

    // Build cost filter
    if(maxCost)
        filter.$lte = Number(maxCost); // only include recipes with cost less than or equal to maxCost

    if(minCost)
        filter.$gte = Number(minCost); // only include recipes with cost greater than or equal to minCost

    // Sort by either ascending or descending
    if(order == "ascend")
        sortOrder = {totalCost: 1};
    else if(order == "descend")
        sortOrder = {totalCost: -1};
    
    // return matched recipes
    const recipes = await Recipe.find(minCost || maxCost ? {totalCost: filter} : {})
    .sort(sortOrder)
    .populate({ path: "appliances", model: Appliance })
    .populate({ path: "ingredients.ingredient", model: Ingredient });
    return NextResponse.json(recipes);
}