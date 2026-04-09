import { connectToDB } from "@/lib/connectToDB";
import Recipe from "@/models/Recipe";
import { NextResponse } from 'next/server';

export async function GET(req: Request){
    try {
        await connectToDB();

        // fetch recipe
        const recipe = await Recipe.findOne().lean() as any;

        // extract tags
        const tagsES = Object.keys(recipe.espTags || {});
        const tagsEN = Object.keys(recipe.tags || {});

        const tags = tagsEN.map((tagEN, index) => ({
            _id: index,
            en: tagEN,
            es: tagsES[index]
        }));

        return NextResponse.json(tags);

    } catch(error) {
        console.error("tags/all API error:", error);
        return NextResponse.json({});
    }
}