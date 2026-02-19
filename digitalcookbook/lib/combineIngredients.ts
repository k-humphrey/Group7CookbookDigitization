import { scaleCost } from "@/lib/scaleRecipe";
import { SelectedRecipe, Ingredient } from "@/app/backpack-planner/page";

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

            // if ingredient already exists in map
            if(ingredientsMap.has(ingredient.ingredient)) {
                const existingIngredient = ingredientsMap.get(ingredient.ingredient)!;
                
                ingredientsMap.set(ingredient.ingredient, {
                    ingredient: ingredient,
                    totalAmount: existingIngredient.totalAmount + (ingredient.amount * scaleFactor),
                    totalCost: existingIngredient.totalCost + (ingredient.amount * scaleFactor * ingredient.costPerUnit * ingredient.multiplier)
                });
                
            } else // Else, add new ingredient to map
                ingredientsMap.set(ingredient.ingredient, {
                    ingredient: ingredient,
                    totalAmount: (ingredient.amount * scaleFactor),
                    totalCost: (ingredient.amount * scaleFactor * ingredient.costPerUnit * ingredient.multiplier)
                });
        });
    });

    // Return Array of combined ingredients
    return Array.from(ingredientsMap.values());
}