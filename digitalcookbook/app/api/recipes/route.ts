import { connectToDB } from "@/lib/connectToDB";
import Recipe from "@/models/Recipe";
import Ingredient from "@/models/Ingredient";
import Appliance from "@/models/Appliance";
import { NextResponse } from 'next/server';

export async function GET(req: Request){
    await connectToDB();
    const recipies = await Recipe.find({})
    .populate({ path: "appliances", model: Appliance })
    .populate({ path: "ingredients.ingredient", model: Ingredient });
    return NextResponse.json(recipies);
}