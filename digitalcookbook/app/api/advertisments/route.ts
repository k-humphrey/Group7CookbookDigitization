import { connectToDB } from "@/lib/connectToDB";
import Advertisment from "@/models/Advertisment";
import { NextRequest, NextResponse } from "next/server";

// read
export async function GET(req: NextRequest){
    try{
        // connect to db
        await connectToDB();
    
        // get advertisements from db and return them
        const ads = await Advertisment.find();
        return NextResponse.json({ ads });

    } catch(error) {
        // error return nothing
        console.error("Advertisments API GET error:", error);
        return NextResponse.json({});
    }
}

// create
export async function POST(req: NextRequest){
    try{
        // connect to db
        await connectToDB();
    
        // get advertisment information
        const { name, imageURI, link } = await req.json();

        // create a new ad
        const ad = await Advertisment.create({ name, imageURI, link });
        return NextResponse.json({ ad });

    } catch(error) {
        // error return nothing
        console.error("Advertisments API POST error:", error);
        return NextResponse.json({});
    }
}

// update
export async function PUT(req: NextRequest){
    try{
        // connect to db
        await connectToDB();
    
        // get advertisment information
        const { _id, name, imageURI, link } = await req.json();

        // update collection
        const ad = await Advertisment.findByIdAndUpdate(
            _id,
            { name, imageURI, link },
            { new: true }
        );
        return NextResponse.json({ ad });

    } catch(error) {
        // error return nothing
        console.error("Advertisments API PUT error:", error);
        return NextResponse.json({});
    }
}

// delete
export async function DELETE(req: NextRequest) {
    try{
        // connect to db
        await connectToDB();
    
        // get advertisment information
        const url = new URL(req.url);
        const id = url.searchParams.get("_id");

        // delete from collection
        await Advertisment.findByIdAndDelete(id);
        return NextResponse.json({ success: true });

    } catch(error) {
        // error return nothing
        console.error("Advertisments API DELETE error:", error);
        return NextResponse.json({ success: false });
    }
}