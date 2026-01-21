import { connectToDB } from "@/lib/connectToDB";
import Appliance from "@/models/models/Appliance";
import { NextResponse } from 'next/server';

export async function GET(req: Request){
    await connectToDB();
    const appliances = await Appliance.find({});
    return NextResponse.json(appliances);
}