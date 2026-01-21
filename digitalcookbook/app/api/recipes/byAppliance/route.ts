import { connectToDB } from "@/lib/connectToDB";
import Recipe from "@/models/models/Recipe";
import Ingredient from "@/models/models/Ingredient";
import Appliance from "@/models/models/Appliance";
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  await connectToDB();

  const url = new URL(req.url);
  const appliancesParams = url.searchParams.get("appliances");

  let filter: any = {};

  if (appliancesParams) {
    const appliancesList = appliancesParams
      .split(",")
      .map(a => a.trim())
      .flatMap(a => [
        { en: { $regex: a, $options: "i" } },
        { es: { $regex: a, $options: "i" } }
      ]);

    // Find matching appliances
    const matchingAppliances = await Appliance.find({
      $or: appliancesList
    }).select("_id").lean();

    const appliancesIds = matchingAppliances.map(a => a._id);

    if (appliancesIds.length > 0) {
      filter["appliances._id"] = { $in: appliancesIds };
    } else {
      // No matches, return empty array
      return NextResponse.json([]);
    }
  }

  // return matched recipes
    const recipes = await Recipe.find(filter)
        .populate({ path: "appliances", model: Appliance })
        .populate({ path: "ingredients", model: Ingredient });

  return NextResponse.json(recipes);
}
