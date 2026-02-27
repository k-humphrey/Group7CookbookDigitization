import { connectToDB } from "@/lib/connectToDB";
import Recipe from "@/models/Recipe";
import Ingredient from "@/models/Ingredient";
import Appliance from "@/models/Appliance";
import { NextResponse } from 'next/server';


export async function GET(req: Request){
    
    await connectToDB();

    // Get url
    const url = new URL(req.url);

    // Get search parameters from url if available
    const appliancesParams = url.searchParams.get("appliances") || null;
    const ingredientsParams = url.searchParams.get("ingredients") || null;
    const healthTagsParams = url.searchParams.get("healthTags") || null;
    const allergenTagsParams = url.searchParams.get("allergenTags") || null;
    const cost = {min: Number(url.searchParams.get("minCost") || null), max: Number(url.searchParams.get("maxCost") || null)};
    const pageInfo = {pageNumber: Number(url.searchParams.get("page") || 1), pageLimit: Number(url.searchParams.get("limit") || 15)};

    const filters: any[] = [];

    // Store info for aggregation
    let ingredientIds: any[] = [];
    let applianceIds: any[] = [];

    // Get possible titles from ingredientparams
    const titles = ingredientsParams?.split(",").map(item => item.replace(/\s+and\s+/gi, " & "));

    // ---------- Filter by ingredients
    if(ingredientsParams) {
        // Convert ingredients array into string so regex can be used (Split ingredients into word parts)
        const ingredientList = ingredientsParams.split(",").flatMap(item => item.split(" ")).filter(Boolean).flatMap(ingredient => [
            {"en": {$regex: ingredient, $options: 'i'}},
            {"es": {$regex: ingredient, $options: 'i'}},
        ]);

        // Connect to the ingredients database and find matching ingredients ids
        const matchingIngredients = await Ingredient.find({"$or": ingredientList}).select('_id').lean();
        
        // Add to filters
        if(matchingIngredients.length > 0) {
            ingredientIds = matchingIngredients.map(ingredient => ingredient._id);
            filters.push({"ingredients.ingredient": {$in: ingredientIds}});
        }
    }   

    // ---------- Filter by appliances
    if(appliancesParams) {
        // Convert appliances array into string so regex can be used
        const appliancesList = appliancesParams.split(",").map(appliance => appliance.trim()).flatMap(appliance => [
            {"en": {$regex: appliance, $options: 'i'}},
            {"es": {$regex: appliance, $options: 'i'}},
        ]);

        // Connect to the appliances database and find matching appliances ids
        const matchingAppliances = await Appliance.find({"$or": appliancesList}).select('_id').lean();

        // Add to filters
        if(matchingAppliances.length > 0) {
            applianceIds = matchingAppliances.map(appliance => appliance._id);
            filters.push({"appliances._id": {$in: applianceIds}});
        }
    }

    // ---------- Filter by health tags
    if (healthTagsParams) {
    const tagsList = healthTagsParams.split(",").map((tag) => tag.trim());

    // match if tag is true (has the health tag)
    tagsList.forEach((tag) => {
        filters.push({ $or: [
            {[`tags.${tag}`]: true},
            {[`espTags.${tag}`]: true}
        ]}); // tags OR espTags language options
    });
    }

    // ---------- Filter by allergen tags
    if (allergenTagsParams) {
    const tagsList = allergenTagsParams.split(",").map((tag) => tag.trim());

    // match if tag is false (does not have the allergen)
    tagsList.forEach((tag) => {
        filters.push({ $or: [
            {[`allergens.${tag}`]: false},
            {[`espAllergens.${tag}`]: false}
        ]}); // allergens OR espAllergens language options
    });
    }

    // ---------- Filter by Cost
    if(cost.max || cost.min) {
        let costFilter: any = {};
        if(cost.max)
            costFilter.$lte = Number(cost.max); // only include recipes with cost less than or equal to maxCost

        if(cost.min)
            costFilter.$gte = Number(cost.min); // only include recipes with cost greater than or equal to minCost

        filters.push({totalCost: costFilter});
    }

    // return matched recipes
    if(filters.length != 0) {
        // Use aggregation to also calculate relevance score and order
        const recipes = await Recipe.aggregate([
            {$match: { $and: filters }},
            {$addFields: 
                {relevanceScore: 
                    {$add: [
                        {$size: {
                            $setIntersection: ["$ingredients.ingredient", ingredientIds] // add 1 for each matching ingredient
                        }},
                        {$size: {
                            $setIntersection: ["$appliances._id", applianceIds] // add 1 for each matching appliance
                        }},
                        /*{$sum: {
                            $map: {
                                input: {
                                    $filter: {
                                        input: "$ingredients",
                                        as: "i",
                                        cond: {
                                            $in: ["$$i.ingredient", ingredientIds] 
                                        } 
                                    } 
                                },
                                as: "matched",
                                in: "$$matched.amount"
                            }
                        }},*/
                        {$cond: [
                            {$or: titles?.map(title => (
                                {$or: [
                                    { $regexMatch: { input: "$title.en", regex: title, options: "i" } },
                                    { $regexMatch: { input: "$title.es", regex: title, options: "i" } }
                                ]}
                            )) || []}, 10, 0 // add 10 if title matches
                        ]}
                    ]
                }
            }},
            {
                $sort: { relevanceScore: -1, _id: 1 } // order by relevance score descending, then id for consistent page order
            },
            {
                $skip: (pageInfo.pageNumber - 1) * pageInfo.pageLimit // Skip recipes for previous pages
            },
            {
                $limit: pageInfo.pageLimit // Limit returned recipes to page limit
            },
            {
                $project: { relevanceScore: 0 } // exclude relevance score from results
            }
        ]);

        // ----No longer need to populate in this api-----
        // populate results with ingredient and appliance info
        //await Recipe.populate(recipes, [{ path: "appliances.appliances", model: Appliance },{ path: "ingredients", model: Ingredient }]);
        
        return NextResponse.json(recipes); // return matched recipes

    } else
        return NextResponse.json({message: "0 recipes matching the description"});

}
