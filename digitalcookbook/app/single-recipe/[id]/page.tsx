// app/single-recipe/[id]/page.tsx
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { connectToDB } from "@/lib/connectToDB";
import Recipe from "@/models/Recipe";
import Appliance from "@/models/Appliance";
import SingleRecipeUI from "@/app/components/singlerecipeui";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = (rawId ?? "").trim();
  
  if (!mongoose.Types.ObjectId.isValid(id)) notFound();

  await connectToDB();

  const recipe = await Recipe.findById(id)
    .populate({ path: "appliances", model: Appliance })
    .lean();

  if (!recipe) notFound();
  const safeRecipe = JSON.parse(JSON.stringify(recipe));

  return <SingleRecipeUI recipe={safeRecipe} />;

}
