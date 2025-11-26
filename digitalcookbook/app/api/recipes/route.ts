import { connectToDB } from "@/lib/connectToDB";
import Recipe from "@/models/models/Recipe";
import Ingredient from "@/models/models/Ingredient";
import Appliance from "@/models/models/Appliance";
import { NextResponse } from 'next/server';

export async function GET(req: Request){
    await connectToDB();
    const recipies = await Recipe.find({}).populate("ingredients.ingredient").populate("appliances");
    return NextResponse.json(recipies);
}