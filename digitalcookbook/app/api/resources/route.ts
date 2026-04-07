import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/connectToDB";
import Resources from "@/models/Resources";

// api to return community resources from db
export async function GET(req: Request){
    try {
        await connectToDB();

        const resources = await Resources.find().sort({ order: 1 }).lean();
        return NextResponse.json(resources);
        
    } catch(error) {
        console.error("Resources API error:", error);
        return NextResponse.json({});
    }
}

// create
export async function POST(req: NextRequest){
    try{
        // connect to db
        await connectToDB();
    
        // get resource information
        const { title, description, link, order } = await req.json();

        // create a new resource
        const resource = await Resources.create({ title, description, link, order });
        return NextResponse.json({ resource });

    } catch(error) {
        // error return nothing
        console.error("Resources API POST error:", error);
        return NextResponse.json({});
    }
}

// update
export async function PUT(req: NextRequest){
    try{
        // connect to db
        await connectToDB();
    
        // get resource information
        const { _id, title, description, link, order } = await req.json();

        // update collection
        const resource = await Resources.findByIdAndUpdate(
            _id,
            { title, description, link, order },
            { new: true }
        );
        return NextResponse.json({ resource });

    } catch(error) {
        // error return nothing
        console.error("Resources API PUT error:", error);
        return NextResponse.json({});
    }
}

// delete
export async function DELETE(req: NextRequest) {
    try{
        // connect to db
        await connectToDB();
    
        // get resource information
        const url = new URL(req.url);
        const id = url.searchParams.get("_id");

        // delete from collection
        await Resources.findByIdAndDelete(id);
        return NextResponse.json({ success: true });

    } catch(error) {
        // error return nothing
        console.error("Resources API DELETE error:", error);
        return NextResponse.json({ success: false });
    }
}