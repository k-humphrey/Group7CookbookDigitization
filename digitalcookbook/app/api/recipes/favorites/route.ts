import { connectToDB } from "@/lib/connectToDB";
import RecipeAnalytics from "@/models/RecipeAnalytics";
import { NextResponse } from 'next/server';

export async function GET(req: Request){
    try {
        await connectToDB();

        // return (recipeId, title, monthlyViewCount) of favorite Recipes (Limited to top 10)
        const favoriteRecipes = await RecipeAnalytics.aggregate([
            { $sort : { 
                monthlyViewCount: -1 
            }},
            { $limit: 10 },
            { $lookup: {
                from: "recipes",
                let: { 
                    rid: { $toObjectId: "$recipeId" }
                },
                pipeline: [
                    { $match: 
                        { $expr: { $eq: ["$_id", "$$rid"] } }
                    }
                ],
                as: "recipe"
            }},
            { $unwind: "$recipe" },
            { $project: {
                recipeId: 1,
                title: "$recipe.title",
                monthlyViewCount: 1
            }}
        ]);

        // return favorites
        return NextResponse.json(favoriteRecipes);

    } catch (e) {
        console.error("recipes/favorites API Error: ", e);
        return NextResponse.json({});
    }
}