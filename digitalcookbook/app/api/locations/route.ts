import { connectToDB } from "@/lib/connectToDB"
import { isAdminAuthenticated } from "@/lib/checkAdminAuth";
import Location from "@/models/Location"
import { NextResponse } from 'next/server';
import { cookies } from "next/headers";

/*Add a Location */
export async function POST(req: Request) {
    //authenticate
    const cookieStore = await cookies(); 
    
    //check authentication
    if (!(await isAdminAuthenticated(cookieStore))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try{   
        await connectToDB()
        const data = await req.json()
        //cast data to location model
        const location = await Location.create(data) 

        return NextResponse.json(
            { success: true, location },
            { status: 201 }
        );
    } catch(err: any){
        //if anything broke, print error
        console.error("POST /api/locations error:", err);
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );
    }
}

/*delete a location*/
export async function DELETE(req: Request){
    //authenticate
    const cookieStore = await cookies(); 
    
    //check authentication
    if (!(await isAdminAuthenticated(cookieStore))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try{   
        await connectToDB() 
        const data = await req.json() 
        if(!data._id){
            return Response.json(
            { error: "Missing _id" },
            { status: 400 }
            )
        }
        
        //delete
        const deleted = await Location.findByIdAndDelete(data._id)
        //check if delete worked
        if(!deleted){
            return Response.json(
                { error: "Location not found" },
                { status: 404 }
            )
        }

        //else assumed successful
        return Response.json({ success: true, deleted })
    } catch(err: any){
        //if anything broke, print error
        console.error("DELETE error:", err);
        return Response.json(
        { error: err.message },
        { status: 500 }
        );
    }
} 

/*update location*/
/*delete a location*/
export async function PUT(req: Request){
    //authenticate
    const cookieStore = await cookies(); 
    
    //check authentication
    if (!(await isAdminAuthenticated(cookieStore))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try{   
        await connectToDB() 
        const data = await req.json() 
        if(!data._id){
            return Response.json(
            { error: "Missing _id" },
            { status: 400 }
            )
        }
        
        //update
        const { _id, ...updateData } = data;
        const updated = await Location.findByIdAndUpdate(
              _id,
              updateData,
              { new: true, runValidators: true }
        );
        
        //check if update worked
        if(!updated){
            return Response.json(
                { error: "Location not found" },
                { status: 404 }
            )
        }

        //else assumed successful
        return Response.json({ success: true, updated })
    } catch(err: any){
        //if anything broke, print error
        console.error("UPDATE error:", err);
        return Response.json(
        { error: err.message },
        { status: 500 }
        );
    }
} 
/*Get a location list*/
export async function GET(){
    await connectToDB();
    const locations = await Location.find({}, { _id: 0 })
    return NextResponse.json(locations)
}