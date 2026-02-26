import { cookies } from "next/headers";
import { isAdminAuthenticated } from "@/lib/checkAdminAuth";
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/connectToDB";
import Recipe from "@/models/Recipe";

//posting, adding new recipes
export async function POST(req: Request) {
  const cookieStore = await cookies(); 

  if (!isAdminAuthenticated(cookieStore)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try{
    await connectToDB();

    const data = await req.json();

    const recipe = await Recipe.create(data);

    return NextResponse.json(
      { success: true, recipe },
      { status: 201 }
    );
  } catch(err: any){
    console.error("POST /api/edit-recipes error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

//updating, update existing recipes
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const updated = await Recipe.findByIdAndUpdate(
      body._id,
      body,
      {
        new: true,          // return updated doc
        runValidators: true // enforce schema rules
      }
    );

    if (!updated) {
      return Response.json({ error: "Recipe not found" }, { status: 404 });
    }

    return Response.json({ success: true, recipe: updated });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
