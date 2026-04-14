import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/connectToDB";
import Safety from "@/models/Safety";

// api to return safety from db
export async function GET(req: Request){
    try {
        await connectToDB();

        const safety = await Safety.find().sort({ order: 1 }).lean();
        return NextResponse.json(safety);
        
    } catch(error) {
        console.error("Safety API GET error:", error);
        return NextResponse.json({});
    }
}

// create
export async function POST(req: NextRequest){
    try{
        // connect to db
        await connectToDB();
    
        // get safety information
        const { title, description, link, order } = await req.json();

        // create a new safety
        const newSafety = await Safety.create({ title, description, link, order });
        return NextResponse.json({ newSafety });

    } catch(error) {
        // error return nothing
        console.error("Safetys API POST error:", error);
        return NextResponse.json({});
    }
}

// update
export async function PUT(req: NextRequest){
    try{
        // connect to db
        await connectToDB();
    
        // get safety information
        const { _id, title, description, link, order } = await req.json();

        // update collection
        const resource = await Safety.findByIdAndUpdate(
            _id,
            { title, description, link, order },
            { new: true }
        );
        return NextResponse.json({ resource });

    } catch(error) {
        // error return nothing
        console.error("Safety API PUT error:", error);
        return NextResponse.json({});
    }
}

// delete
export async function DELETE(req: NextRequest) {
    try{
        // connect to db
        await connectToDB();
    
        // get safety information
        const url = new URL(req.url);
        const id = url.searchParams.get("_id");

        // delete from collection
        await Safety.findByIdAndDelete(id);
        return NextResponse.json({ success: true });

    } catch(error) {
        // error return nothing
        console.error("Safety API DELETE error:", error);
        return NextResponse.json({ success: false });
    }
}