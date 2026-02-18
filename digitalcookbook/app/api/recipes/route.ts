import { connectToDB } from "@/lib/connectToDB";
import Recipe from "@/models/Recipe";
import { NextResponse } from 'next/server';
import { cookies } from "next/headers";
//import Ingredient from "@/models/Ingredient";
//import Appliance from "@/models/Appliance";

export async function GET(req: Request){
    const cookieStore = await cookies(); 
    
    await connectToDB(cookieStore);

    // Get page info
    const url = new URL(req.url);
    const pageInfo = {pageNumber: Number(url.searchParams.get("page") || 1), pageLimit: Number(url.searchParams.get("limit"))};

    let recipes;
    if(pageInfo.pageLimit) { // if limit return recipes limited
        recipes = await Recipe.find({})
        .skip((pageInfo.pageNumber - 1) * pageInfo.pageLimit)
        .limit(pageInfo.pageLimit)
        //---no longer need to populate this api---
        //.populate({ path: "appliances", model: Appliance })
        //.populate({ path: "ingredients.ingredient", model: Ingredient });

    } else { // else return all recipes
        recipes = await Recipe.find({})
        //---no longer need to populate this api---
        //.populate({ path: "appliances", model: Appliance })
        //.populate({ path: "ingredients.ingredient", model: Ingredient });

    }

    return NextResponse.json(recipes);
}