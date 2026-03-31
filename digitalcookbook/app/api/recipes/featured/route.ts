import { connectToDB } from "@/lib/connectToDB";
import FeaturedRecipes from "@/models/FeaturedRecipes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){

    try{
        // connect to db
        await connectToDB();
    
        // get featured recipes from db
        const featured = await FeaturedRecipes.findOne({}).populate("recipeIds");

        // Return featured recipes if they exist, else return nothing
        return NextResponse.json({ recipes: featured.recipeIds });

    } catch(error) {
        // error return nothing
        console.error("FeaturedRecipe API error:", error);
        return NextResponse.json({});
    }
}

export async function POST(req: NextRequest){

    try{
        // connect to db
        await connectToDB();
    
        // featured recipe ids
        const { recipeIds } = await req.json();

        // update collection to new recipe ids
        const featured = await FeaturedRecipes.findOneAndUpdate(
            {},
            { recipeIds },
            { new: true, upsert: true}
        );
        return NextResponse.json({ recipes: featured.recipeIds });

    } catch(error) {
        // error return nothing
        console.error("FeaturedRecipe API error:", error);
        return NextResponse.json({});
    }
}