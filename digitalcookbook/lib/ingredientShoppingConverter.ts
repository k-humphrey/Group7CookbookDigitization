import { CombinedIngredient } from "@/lib/combineIngredients";
import { IngredientPriceInfo } from "@/app/api/ingredients/byIDsGetIngredientPriceInfo/route";

// type for shopping list item
export type ShoppingListIngredient = {
    ingredientName: string;
    storeName: string;
    packagesNeeded: number;
    totalCost: number;
}

// helper function to convert unit to package unit
function convertAmount(amount: number, fromUnit: string, toUnit: string, conversions: any[]) {
    // No conversion needed, return amount
    if(fromUnit == toUnit)
        return amount;

    // Find matching conversion
    const match = conversions.find((conversion) => conversion.fromUnit == fromUnit && conversion.toUnit == toUnit);
    
    // return scaled amount if match, else return amount
    return match ? amount * match.multiplier : amount;
}

// Convert combinedIngredients and ingredientPriceInfo into a shoppingList
export function ingredientShoppingConverter(combinedIngredients: CombinedIngredient[], ingredientPriceInfo: Record<string, IngredientPriceInfo>, lang: "en" | "es"): { shoppingList: ShoppingListIngredient[]; totalShoppingCost: number; } {
    let totalShoppingCost = 0;

    // Loop through combinedIngredients and convert ingredients to shopping list ingredients
    const shoppingList = combinedIngredients.map((combinedIngredient) => {
        try {
            const { ingredient, totalAmount, totalCost } = combinedIngredient;
            const priceInfo = ingredientPriceInfo[ingredient.ingredient];

            // Skip very small quantites of grams (like pepper)
            if(ingredient.unit === "g" && ingredient.amount < 5)
                return null;

            // Dont convert if ingredient counted in "each"
            if(ingredient.unit === "each") {
                totalShoppingCost += Math.ceil(totalAmount) * priceInfo.price;

                return {
                    ingredientName: ingredient.ingredient,
                    storeName: ingredient?.[lang],
                    packagesNeeded: Math.ceil(totalAmount),
                    totalCost: Math.ceil(totalAmount) * priceInfo.price
                };
            }

            if(ingredient.unit === "count") {
                totalShoppingCost += (priceInfo.price / priceInfo.packageSize) * Math.ceil(totalAmount);

                return {
                    ingredientName: ingredient.ingredient,
                    storeName: ingredient?.[lang],
                    packagesNeeded: Math.ceil(totalAmount / priceInfo.packageSize),
                    totalCost: (priceInfo.price / priceInfo.packageSize) * Math.ceil(totalAmount)
                };
            }

            // Fallback to combinedIngredients if packageSize not set yet
            if(priceInfo.packageSize === 1 && ingredient.unit !== "each") {
                totalShoppingCost += totalCost;

                return {
                    ingredientName: ingredient.ingredient,
                    storeName: ` ${ingredient.unit} ${ingredient?.[lang]}`,
                    packagesNeeded: totalAmount,
                    totalCost: totalCost
                };
            }

            // convert ingredient amount to the unit for packageSize
            const convertedAmount = convertAmount(totalAmount, ingredient.unit, priceInfo.unit, priceInfo.conversions);
            
            // Calculate how many packages needed and the total price of said packages
            const packagesNeeded = Math.ceil(convertedAmount / priceInfo.packageSize);
            const totalPackageCost = packagesNeeded * priceInfo.price;

            // add totalPackage cost
            totalShoppingCost += totalPackageCost;

            // return shoppingList item
            return {
                ingredientName: ingredient.ingredient,
                storeName: ingredient?.[lang],
                packagesNeeded: packagesNeeded,
                totalCost: totalPackageCost
            };
        } catch { // error converting, defualt to none
            return {
                ingredientName: "",
                storeName: "",
                packagesNeeded: 0,
                totalCost: 0
            };
        }
    }).filter(ingredient => ingredient !== null);

    // return full shoppingList and totals
    return { shoppingList, totalShoppingCost: totalShoppingCost };
}
