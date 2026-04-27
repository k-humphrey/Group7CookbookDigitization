import { connectToDB } from "@/lib/connectToDB";
import Ingredient from "@/models/Ingredient";
import Recipe from "@/models/Recipe";
import Conversions from "@/models/Conversions";
import { NextResponse, NextRequest } from 'next/server';

function getMultiplier(units: any[], from: string, to: string) {
    if (from === to) return 1;

    const direct = units.find(unit => unit.fromUnit === from && unit.toUnit === to);
    if (direct) return direct.multiplier;

    const reverse = units.find(unit => unit.fromUnit === to && unit.toUnit === from);
    if (reverse) return 1 / reverse.multiplier;

    return null;
}

export async function GET(req: Request){
    try {
        // connect to db
        await connectToDB();

        // return all ingredients
        const ingredients = await Ingredient.find({});
        return NextResponse.json(ingredients);

    } catch(error) {
        // error return nothing
        console.error("Ingredients API GET error:", error);
        return NextResponse.json({});
    }
}

// create
export async function POST(req: NextRequest){
    try{
        // connect to db
        await connectToDB();
    
        // get ingredient information
        const { en, es, baseUnit, productLink, price, storeName, packageSize } = await req.json();
        const costPerUnit = packageSize && packageSize > 0 ? price/Number(packageSize) : price;

        // create a new ingredient
        const ingredient = await Ingredient.create({ en, es, baseUnit, productLink, price, storeName, packageSize, costPerUnit });
        return NextResponse.json({ ingredient });

    } catch(error) {
        // error return nothing
        console.error("Ingredient API POST error:", error);
        return NextResponse.json({});
    }
}

// update
export async function PUT(req: NextRequest){
    try{
        // connect to db
        await connectToDB();
    
        // get Ingredient information
        const { _id, en, es, baseUnit, productLink, price, storeName, packageSize } = await req.json();
        const costPerUnit = packageSize && packageSize > 0 ? price/Number(packageSize) : price;

        // update collection
        const ingredient = await Ingredient.findByIdAndUpdate(
            _id,
            { en, es, baseUnit, productLink, price, storeName, packageSize, costPerUnit },
            { new: true }
        );

        // fetch units
        const units = await Conversions.find({});

        // update recipes containing ingredient
        const recipes = await Recipe.find({ "ingredients.ingredient" : ingredient._id });
        for(let recipe of recipes) {
            let totalCost = 0;

            recipe.ingredients = recipe.ingredients.map((ing: any) => {
                if (String(ing.ingredient) === String(ingredient._id)) {
                    // Recalculate costs
                    const multiplier = getMultiplier(units, ing.unit, ingredient.baseUnit);

                    if (multiplier === null) {
                        throw new Error(`Missing conversion: ${ing.unit} → ${ingredient.baseUnit}`);
                    }

                    const ingredientCost = (ingredient.costPerUnit || 0) * ((Number(ing.amount) || 0) * (multiplier));
                    totalCost += ingredientCost;

                    return {
                        ...ing,
                        en: ingredient.en,
                        es: ingredient.es,
                        costPerUnit: costPerUnit,
                        baseUnit: ingredient.baseUnit,
                        productLink: ingredient.productLink,
                        price: price,
                        multiplier,
                        ingredientCost
                    };

                } else {
                    totalCost += ing.ingredientCost || 0;
                    return ing;

                }
            });

            // Update recipe total cost
            recipe.totalCost = totalCost;
            await recipe.save();
        }

        return NextResponse.json({ ingredient, syncedRecipes: recipes.length });

    } catch(error) {
        // error return nothing
        console.error("Ingredient API PUT error:", error);
        return NextResponse.json({});
    }
}