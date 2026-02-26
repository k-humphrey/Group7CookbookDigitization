import { connectToDB } from "@/lib/connectToDB";
import Appliance from "@/models/Appliance";
import { NextResponse } from 'next/server';

export async function GET(req: Request){
    await connectToDB();

    // get language option
    const url = new URL(req.url);
    const lang = url.searchParams.get("lang") == "es" ? "es" : "en";

    const appliances = await Appliance.find().select(`${lang} -_id`);
    return NextResponse.json(appliances.map(appliance => appliance[lang]));
}
