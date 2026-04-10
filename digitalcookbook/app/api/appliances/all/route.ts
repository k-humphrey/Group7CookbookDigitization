import { connectToDB } from "@/lib/connectToDB";
import Appliance from "@/models/Appliance";
import { NextResponse } from 'next/server';

// return all appliances with all language options and id
export async function GET(req: Request){
    try {
        await connectToDB();

        const appliances = await Appliance.find().select("en es");
        return NextResponse.json(appliances);

    } catch(error) {
        console.error("appliances/all API error:", error);
        return NextResponse.json({});
    }
}
