// app/single-recipe/[id]/page.tsx
import { notFound } from "next/navigation";
import { connectToDB } from "@/lib/connectToDB";
import Recipe from "@/models/Recipe";
import Appliance from "@/models/Appliance";
import SingleRecipeUI from "@/app/components/singlerecipeui";

export default async function Page({ params }: { params: { id: string } }) {
  await connectToDB();

  const recipe = await Recipe.findById(params.id)
    .populate({ path: "appliances", model: Appliance })
    .lean()
    .catch(() => null); // handles invalid ObjectId + other query errors

  if (!recipe) notFound();

  return <SingleRecipeUI recipe={recipe as any} />;
}
