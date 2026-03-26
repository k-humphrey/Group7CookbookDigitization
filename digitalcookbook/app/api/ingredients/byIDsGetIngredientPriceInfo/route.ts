import { connectToDB } from "@/lib/connectToDB"
import Ingredient from "@/models/Ingredient";
import Conversions from "@/models/Conversions";
import { NextResponse } from 'next/server';

// type for conversion info
type Conversion = {
    fromUnit: string;
    toUnit: string;
    multiplier: number;
}

// type for ingredient price info being returned
export type IngredientPriceInfo = {
    price: number;
    packageSize: number;
    storeName: string;
    unit: string;
    conversions: Conversion[];
}

// GET api that returns the IngredientPriceInfo needed to convert into shopping list
export async function GET(req: Request){
    // get ids from url
    const url = new URL(req.url);
    const ids = url.searchParams.get("ids")?.split(",").map(id => id.trim()).filter(id => id && id.length >= 1);

    // connect to database
    await connectToDB();

    // return nothing if no ids
    if(!ids || ids.length === 0) {
        return NextResponse.json({});
    }

    // Find ingredientInfo needed
    const ingredients = await Ingredient.find(
        { _id: { $in: ids } },
        { price: 1, packageSize: 1, storeName: 1, unit: 1 },
    ).lean();

    // Find conversionInfo needed
    const conversions = await Conversions.find({}).lean<Conversion[]>();

    // Construct ingredientPriceInfo and add each ingredients info
    let ingredientPriceInfo: Record<string, IngredientPriceInfo> = {};
    ingredients.forEach((ingredient) => {
        ingredientPriceInfo[(ingredient._id as string).toString()] = {
            price: ingredient.price ?? 0,
            packageSize: ingredient.packageSize ?? 1,
            storeName: ingredient.storeName,
            unit: ingredient.unit ?? "oz",
            conversions: conversions
        };
    });

    // return ingredientPriceInfo
    return NextResponse.json(ingredientPriceInfo);
}