"use client";

import { SelectedRecipe } from "@/app/meal-planner/page";
import { scaleCost, scaleIngredient } from "@/lib/scaleRecipe";
import { useLang } from "@/app/components/languageprovider";
import { PLANNER_STRINGS } from "@/app/meal-planner/plannerStrings";
import Image from "next/image";

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

        <div key={recipe._id} className="mt-4 bg-base-100 shadow-xl rounded-xl p-4 md:p-6 flex flex-col md:flex-row md:gap-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral focus-visible:ring-offset-1" tabIndex={0}>

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
                <div className="w-full md:flex-1 h-80 md:h-auto rounded-lg overflow-hidden relative shrink-0 mt-3">
                    <Image
                        src={recipe.imageURI.trimEnd()}
                        alt={recipe.title?.[lang]}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                    />
                </div>
            )}
        </div>
    );
}
