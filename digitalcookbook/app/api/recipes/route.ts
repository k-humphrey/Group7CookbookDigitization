import { connectToDB } from "@/lib/connectToDB";
import Recipe from "@/models/Recipe";
import Ingredient from "@/models/Ingredient";
import Appliance from "@/models/Appliance";
import { NextResponse } from 'next/server';

export async function GET(req: Request){
    await connectToDB();

    // Get page info
    const url = new URL(req.url);
    const pageInfo = {pageNumber: Number(url.searchParams.get("page") || 1), pageLimit: Number(url.searchParams.get("limit") || 20)};

    let recipes;
    if(pageInfo.pageLimit) { // if limit return recipes limited
        recipes = await Recipe.find({})
        .skip((pageInfo.pageNumber - 1) * pageInfo.pageLimit)
        .limit(pageInfo.pageLimit)
        .populate({ path: "appliances", model: Appliance })
        .populate({ path: "ingredients.ingredient", model: Ingredient });

    } else { // else return all recipes
        recipes = await Recipe.find({})
        .populate({ path: "appliances", model: Appliance })
        .populate({ path: "ingredients.ingredient", model: Ingredient });

    }

    return NextResponse.json(recipes);
}