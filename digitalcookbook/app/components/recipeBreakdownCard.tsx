"use client";

import { SelectedRecipe } from "@/app/meal-planner/page";
import { scaleCost, scaleIngredient } from "@/lib/scaleRecipe";
import { useLang } from "@/app/components/languageprovider";
import { PLANNER_STRINGS } from "@/app/meal-planner/plannerStrings";

// Props needed to render recipe breakdown card
interface Props {
    selectedRecipe: SelectedRecipe;
}

export default function RecipeBreakdownCard({ selectedRecipe }: Props) {
    // Lang settings
    const langContext = useLang();
    const lang = langContext?.lang ?? "en";
    const t = PLANNER_STRINGS[lang];

    // Function to split ingredientPlainText
    function getScaledIngredients(recipe: any, servings: number) {
        const { scaleFactor } = scaleCost(recipe.totalCost, servings);

        return recipe.ingredientPlainText[lang]
            .split("|||")
            .map((ingredient: string) => scaleIngredient(ingredient, scaleFactor));
    }

    // Store recipe information
    const { recipe, servings } = selectedRecipe;
    const { scaledCost, scaleFactor } = scaleCost(recipe.totalCost, servings);
    const ingredients = getScaledIngredients(recipe, servings);

    return (

        <div key={recipe._id} className="bg-base-100 shadow-xl rounded-xl p-6 flex flex-col md:flex-row gap-6">

            {/* Ingredients */}
            <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{recipe.title?.[lang]}</h3>

                <p>{t.servings}: <b>{servings}</b></p>
                <p>{t.cost}: <b>${scaledCost.toFixed(2)}</b></p>

                <div className="mt-4">
                    <h4 className="font-semibold">{t.ingredientsNeeded}</h4>
            
                    <ul className="list-disc ml-6 mt-2 space-y-1">
                        {ingredients.map((ingredient: string, index: number) => (<li key={index}>{ingredient}</li>))}
                    </ul>
                </div>
            </div>

            {/* Image */}
            {recipe.imageURI && (
                <div className="flex-none w-100 h-80 rounded-lg overflow-hidden">
                    <img
                        src={recipe.imageURI}
                        alt={recipe.title?.[lang]}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
        </div>
    );
}