import { connectToDB } from "@/lib/connectToDB";
import Recipe from "@/models/Recipe";
import { NextResponse } from 'next/server';

export async function GET(req: Request){
    try {
        await connectToDB();
        
        // fetch recipe
        const recipe = await Recipe.findOne().lean() as any;

        // extract allergens
        const allergensES = Object.keys(recipe.espAllergens || {});
        const allergensEN = Object.keys(recipe.allergens || {});

        const allergens = allergensEN.map((allergenEN, index) => ({
            _id: index,
            en: allergenEN,
            es: allergensES[index]
        }));

        return NextResponse.json(allergens);
    } catch(error) {
        console.error("appliances/all API error:", error);
        return NextResponse.json({});
    }
}