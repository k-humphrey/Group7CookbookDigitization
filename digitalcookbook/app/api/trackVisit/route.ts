import { connectToDB } from "@/lib/connectToDB";
import RecipeAnalytics from "@/models/RecipeAnalytics";
import { NextResponse, NextRequest } from "next/server";

// get seconds till end of month
function getSecondsUntilNextMonth() {
    const startOfThisMonth = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1, 0, 0, 0));
    const startOfNextMonth = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth() + 1, 1, 0, 0, 0));

    return Math.floor((startOfNextMonth.getTime() - startOfThisMonth.getTime()) / 1000);
}

export async function POST(req: NextRequest){
    try {
        await connectToDB();

        // Get recipe info from request body
        const body = await req.json();
        const { recipeId } = body;

        // Validate recipeId
        if(!recipeId)
            return NextResponse.json({ error: "Missing recipeId" });

        // get first of month
        const firstOfMonth = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1, 0, 0, 0));

        // remove existing ttl index if it exists
        try {
            await RecipeAnalytics.collection.dropIndex("monthCreated_1");
        } catch {}

        // set ttl index
        await RecipeAnalytics.collection.createIndex({ monthCreated: 1 }, { expireAfterSeconds: getSecondsUntilNextMonth()});

        // Increment monthly visit count for the recipe, or create a new record if it doesn't exist
        const analytics = await RecipeAnalytics.findOneAndUpdate(
            { recipeId },
            { $inc: { monthlyViewCount: 1 }, $setOnInsert: { monthCreated: firstOfMonth }},
            { upsert: true, new: true}
        );

        // return response
        return NextResponse.json({ success: true, analytics});

    } catch (e) {
        console.error("trackVisit API Error: ", e);
    }
}