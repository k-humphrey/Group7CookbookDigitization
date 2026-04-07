import { connectToDB } from "@/lib/connectToDB";
import Ingredient from "@/models/Ingredient";
import { NextResponse } from 'next/server';

export async function GET(req: Request){
    try {
        // connect to db
        await connectToDB();

        // return all ingredients
        const ingredients = await Ingredient.find({});
        return NextResponse.json(ingredients);

    } catch(error) {
        // error return nothing
        console.error("Ingredients API error:", error);
        return NextResponse.json({});
    }
}