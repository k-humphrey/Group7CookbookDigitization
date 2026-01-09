import { connectToDB } from "@/lib/connectToDB";
import Recipe from "@/models/Recipe";
import Ingredient from "@/models/Ingredient";
import Appliance from "@/models/Appliance";
import { NextResponse } from 'next/server';

export async function GET(req: Request){
    await connectToDB();

    // Get search parameters
    const url = new URL(req.url);
    const appliancesParams = url.searchParams.get("appliances") || null;

    let filter: any = {};
    
    if(appliancesParams) {
        // Convert appliances array into string so regex can be used
        const appliancesList = appliancesParams.split(",").map(appliance => appliance.trim()).flatMap(appliance => [
            {"en": {$regex: appliance, $options: 'i'}},
            {"es": {$regex: appliance, $options: 'i'}},
        ]);

        // Connect to the appliances database and find matching appliances ids
        const matchingAppliances = await Appliance.find({"$or": appliancesList}).select('_id');
        const appliancesIds = matchingAppliances.map(appliance => appliance._id);

        // Create filter 
        filter["appliances"] = {$in: appliancesIds};

    }

    // return matched recipes
    const recipies = await Recipe.find(filter)
        .populate({ path: "appliances", model: Appliance })
        .populate({ path: "ingredients.ingredient", model: Ingredient });
    return NextResponse.json(recipies);
}