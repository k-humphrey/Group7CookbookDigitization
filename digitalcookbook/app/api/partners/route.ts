import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/connectToDB";
import Partners from "@/models/Partners";

// api to return community partners from db
export async function GET(req: Request){
    try {
        await connectToDB();

        const partners = await Partners.find().sort({ order: 1 }).lean();
        return NextResponse.json(partners);
        
    } catch(error) {
        console.error("Partners API GET error:", error);
        return NextResponse.json({});
    }
}

// create
export async function POST(req: NextRequest){
    try{
        // connect to db
        await connectToDB();
    
        // get partner information
        const { title, description, link, order } = await req.json();

        // create a new partner
        const partners = await Partners.create({ title, description, link, order });
        return NextResponse.json({ partners });

    } catch(error) {
        // error return nothing
        console.error("Partners API POST error:", error);
        return NextResponse.json({});
    }
}

// update
export async function PUT(req: NextRequest){
    try{
        // connect to db
        await connectToDB();
    
        // get partner information
        const { _id, title, description, link, order } = await req.json();

        // update collection
        const resource = await Partners.findByIdAndUpdate(
            _id,
            { title, description, link, order },
            { new: true }
        );
        return NextResponse.json({ resource });

    } catch(error) {
        // error return nothing
        console.error("Partners API PUT error:", error);
        return NextResponse.json({});
    }
}

// delete
export async function DELETE(req: NextRequest) {
    try{
        // connect to db
        await connectToDB();
    
        // get partner information
        const url = new URL(req.url);
        const id = url.searchParams.get("_id");

        // delete from collection
        await Partners.findByIdAndDelete(id);
        return NextResponse.json({ success: true });

    } catch(error) {
        // error return nothing
        console.error("Partners API DELETE error:", error);
        return NextResponse.json({ success: false });
    }
}