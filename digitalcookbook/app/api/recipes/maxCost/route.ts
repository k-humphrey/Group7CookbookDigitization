import { connectToDB } from "@/lib/connectToDB";
import Recipe from "@/models/Recipe";
import { NextResponse } from 'next/server';

export async function GET(req: Request){
    await connectToDB();
    
    // find highest cost from database
    const result = await Recipe.aggregate([{
        $group: {
            _id: null,
            maxCost: { $max: "$totalCost"},
        }
    }]);

    // returns the highest totalCost currently in the database
    return NextResponse.json({maxCost: result[0]?.maxCost ?? 0});
}