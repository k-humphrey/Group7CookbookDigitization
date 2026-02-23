"use client";

import { SelectedRecipe } from "@/app/meal-planner/page"
import { useLang } from "@/app/components/languageprovider";
import { combineIngredients } from "@/lib/combineIngredients";
import { decimalToFraction } from "@/lib/fractionConverter";

import { PLANNER_STRINGS } from "@/app/meal-planner/plannerStrings";
import { MEASUREMENT_STRINGS } from "@/app/measurement-converter/measurementStrings"; 

// Components
import RecipeBreakdownCard from "@/app/components/recipeBreakdownCard";

// Pass in selected recipes
interface Props {
    selectedRecipes: SelectedRecipe[];
}

// Component to show summary of selected recipes, total costs, and scaled ingredients
export default function PlanSummary({ selectedRecipes }: Props) {
    // Lang settings
    const langContext = useLang();
    const lang = langContext?.lang ?? 'en';
    const t = PLANNER_STRINGS[lang];
    const units: Record<string, string> = MEASUREMENT_STRINGS[lang].units;

    // Combine ingredients and calculate totals
    const combinedIngredients = combineIngredients(selectedRecipes);
    const totalServings = selectedRecipes.reduce((total, item) => total + item.servings, 0);
    const totalRecipesCost = combinedIngredients.reduce((total, item) => total + item.totalCost, 0).toFixed(2);
    
    // Render summary of plan totals and breakdown for each selected recipe
    return (
        <div className="mt-16 space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* PLAN TOTALS */}
                <div className="bg-base-200 p-6 rounded-xl shadow lg:col-span-1 lg:h-50">
                    
                    <h2 className="text-2xl font-bold mb-4">{t.planTotals}</h2>

                    <p className="text-lg">{t.totalServings}: <b>{totalServings}</b></p>
                    <p className="text-lg">{t.totalCost}: <b>${totalRecipesCost}</b></p>

                </div>

                {/* TOTAL INGREDIENTS */}
                <div className="bg-base-200 p-6 rounded-xl shadow lg:col-span-2 lg:h-50 overflow-y-auto">
                    <h2 className="text-2xl font-bold mb-4">{t.totalIngredients}</h2>

                    <ul className="list-disc ml-6 space-y-2">
                        {combinedIngredients.map((item, index) => (

                            <li key={index}>
                                <b>{decimalToFraction(item.totalAmount, item.ingredient.unit)} {item.ingredient.unit.toLowerCase() === "each" ? "" : units[item.ingredient.unit?.toLowerCase()] || item.ingredient.unit} {item.ingredient?.[lang] ?? item.ingredient.ingredient}</b>
                                {} — ${item.ingredient.costPerUnit.toFixed(2)} per {item.ingredient.baseUnit} {} (${item.totalCost.toFixed(2)})
                            </li>
                            
                        ))}
                    </ul>
                </div>

            </div>

            {/* RECIPE BREAKDOWN CARDS */}
            {selectedRecipes.map((item) => {
                return (
                    <RecipeBreakdownCard
                        key={item.recipe._id}
                        selectedRecipe={item}
                    />
                );
            })}

        </div>
    );
}