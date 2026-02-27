//app/api/edit-recipes/route.ts

import { cookies } from "next/headers";
import { isAdminAuthenticated } from "@/lib/checkAdminAuth";
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/connectToDB";
import Recipe from "@/models/Recipe";

//posting, adding new recipes
export async function POST(req: Request) {
  const cookieStore = await cookies(); 

  //check authentication
  if (!isAdminAuthenticated(cookieStore)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try{
    await connectToDB();

    //get json recipe as data
    const data = await req.json();
    //cast data to the recipe model, add to the db
    const recipe = await Recipe.create(data);

    //return if successful
    return NextResponse.json(
      { success: true, recipe },
      { status: 201 }
    );
  } catch(err: any){
    //if anything broke, print error
    console.error("POST /api/edit-recipes error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

//updating, update existing recipes
export async function PUT(req: Request) {
  const cookieStore = await cookies(); 

  //check authentication
  if (!isAdminAuthenticated(cookieStore)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    //connect to db if not
    await connectToDB();
    //get data back from request
    const body = await req.json();

    //if there is no recipe id, don't update
    if (!body._id) {
      return Response.json(
        { error: "Missing _id" },
        { status: 400 }
      );
    }

    //try to update the recipe in the db
    const updated = await Recipe.findByIdAndUpdate(
      body._id,
      body,
      { new: true, runValidators: true }
    );

    //if it didn't work, print that out
    if (!updated) {
      return Response.json(
        { error: "Recipe not found" },
        { status: 404 }
      );
    }
    //if it worked, print that out too
    return Response.json({ success: true, recipe: updated });

  } catch (err: any) { //catch all other errors
    console.error("PUT error:", err);
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}