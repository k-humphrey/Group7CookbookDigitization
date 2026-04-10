import { connectToDB } from "@/lib/connectToDB";
import Conversions from "@/models/Conversions";
import { NextResponse } from 'next/server';

export async function GET(req: Request){
    try {
        await connectToDB();

        // fetch units
        const units = await Conversions.find({});

        // return uniqueUnits
        return NextResponse.json({ uniqueUnits: units });

    } catch(error) {
        console.error("units API error:", error);
        return NextResponse.json({});
    }
}