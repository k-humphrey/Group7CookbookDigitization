// app/single-recipe/[id]/page.tsx
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { connectToDB } from "@/lib/connectToDB";
import Recipe from "@/models/Recipe";
import Appliance from "@/models/Appliance";
import SingleRecipeUI from "@/app/components/singlerecipeui";

// This is a Server Component page (async by default in the app router).
// It loads the recipe from MongoDB and then renders <SingleRecipeUI />.
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Pull the id out of the route params.
  const { id: rawId } = await params;

  // Normalize the id:
  // - fallback to "" if it's missing
  // - trim whitespace just in case
  const id = (rawId ?? "").trim();

  // Safety check: if it's not a valid Mongo ObjectId, immediately show 404
  if (!mongoose.Types.ObjectId.isValid(id)) notFound();

  // Ensure a DB connection exists before querying (needed with promise from line 15)
  await connectToDB();

  // Fetch the recipe document by its _id
  // Then "populate" referenced ObjectIds so you get full docs instead of IDs:
  // - appliances: [ObjectId]  -> full Appliance docs
  // `.lean()` returns a plain JS object
  const recipe = await Recipe.findById(id)
    .populate({ path: "appliances", model: Appliance })
    .lean();

  // If nothing came back (no recipe with that id), show 404
  if (!recipe) notFound();

  // Render the UI component and pass the recipe data into it as props.
  return <SingleRecipeUI recipe={recipe as any} />;
}
