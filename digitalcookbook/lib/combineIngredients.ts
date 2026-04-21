import { scaleCost } from "@/lib/scaleRecipe";

// Type for ingredient
export type Ingredient = {
    costPerUnit: number;
    ingredient: string;
    amount: number;
    unit: string;
    en: string;
    es: string;
    baseUnit: string;
    productLink: string;
    ingredientCost: number;
};

// Type for recipe
export type Recipe = {
    _id: string;
    title: {en: string; es: string};
    totalCost: number;
    ingredients: Ingredient[];
    ingredientPlainText: {en: string; es: string};
    imageURI: string;
    instructions: {en: string; es: string};
};

// Type for selected recipe with servings
export type SelectedRecipe = {
    recipe: Recipe;
    servings: number;
}

// Type definition for combined ingredient details
export type CombinedIngredient = {
  ingredient: Ingredient;
  totalAmount: number;
  totalCost: number;
};

export function combineIngredients(selectedRecipes: SelectedRecipe[]) {
    const ingredientsMap = new Map<string, CombinedIngredient>();

    // Loop through each recipe
    selectedRecipes.forEach(({ recipe, servings }) => {
        const { scaleFactor } = scaleCost(recipe.totalCost, servings);

        // Loop through each ingredient in the recipe
        recipe.ingredients?.forEach((ingredient: Ingredient) => {

            // use ingredientCost if it exists, otherwise fallback to costPerUnit
            const unscaledCost = ingredient.ingredientCost ?? ingredient.costPerUnit;

            // if ingredient already exists in map
            if(ingredientsMap.has(ingredient.ingredient)) {
                const existingIngredient = ingredientsMap.get(ingredient.ingredient)!;
                
                ingredientsMap.set(ingredient.ingredient, {
                    ingredient: ingredient,
                    totalAmount: existingIngredient.totalAmount + (ingredient.amount * scaleFactor),
                    totalCost: existingIngredient.totalCost + (scaleFactor * unscaledCost)
                });
                
            } else // Else, add new ingredient to map
                ingredientsMap.set(ingredient.ingredient, {
                    ingredient: ingredient,
                    totalAmount: (ingredient.amount * scaleFactor),
                    totalCost: (scaleFactor * unscaledCost)
                });
        });
    });

    // Return Array of combined ingredients
    return Array.from(ingredientsMap.values());
}