import { connectToDB } from "@/lib/connectToDB"
import Location from "@/models/Location"
import { NextResponse } from 'next/server';

/*Add a Location */
export async function POST(req: Request) {
}

/*Get a location list*/
export async function GET(){
    await connectToDB();
    const locations = await Location.find({}, { _id: 0 })
    return NextResponse.json(locations)
}