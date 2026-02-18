import { fractionToDecimal, decimalToFraction } from "@/lib/fractionConverter";

// default servings for the recipe
const BASE_SERVINGS = 4;

// scale total cost based on desired servings
export function scaleCost(totalCost: number, desiredServings: number) {
    const scaleFactor = desiredServings / BASE_SERVINGS;

    // return scale factor and scaled total cost
    return {scaleFactor: scaleFactor, scaledCost: totalCost * scaleFactor};
}

// scale ingredient string quantity based on scale factor
export function scaleIngredient(ingredient: string, scaleFactor: number) {
    // regex to find numbers, fractions, and mixed numbers
    const fractionRegex = /\d+\s\d+\/\d+|\d+\s[⅛⅙¼⅓½⅔¾]|\d+\/\d+|[⅛⅙¼⅓½⅔¾]|\d+\.\d+|\d+/g;

    // replace quantity in ingredient string with scaled quantity and return
    return ingredient.replace(fractionRegex, (match, offset) => {
        const scaledDecimalValue = fractionToDecimal(match) * scaleFactor;

        // Dont convert to fraction if unit is ounce (package sizes) or if measurement (e.g. 12" or 12-inch)
        const unit = ingredient.slice(offset + match.length).trim().split(/[\s,()]+/)[0];
        const prevWord = ingredient.slice(0, offset).trim().split(/[\s,()]+/).pop() || "";
        
        if(!(prevWord.toLowerCase() == "of") && (unit.startsWith(`”`) || unit.toLowerCase().endsWith("-inch") || unit.match(/^(oz|fl|ml|g|kg|count)/)))
            return match

        // return scaled quantity as fraction
        return decimalToFraction(scaledDecimalValue, unit);
    });
}
