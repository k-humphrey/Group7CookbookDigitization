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

const focusClasses = "focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral focus-visible:ring-offset-1 rounded";

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
        <div className="mt-15 gap-3 flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

                {/* PLAN TOTALS */}
                <div className={focusClasses + " card bg-base-200 rounded-xl shadow lg:col-span-1 h-50"} tabIndex={0}>
                    <div className="card-body text-lg overflow-y-auto">
                        <h2 className="card-title text-2xl font-bold mb-4">{t.planTotals}</h2>

                        <ul>
                            <li>{t.totalServings}: <b>{totalServings}</b></li>
                            <li>{t.totalCost}: <b>${totalRecipesCost}</b></li>
                        </ul>
                    </div>
                </div>

                {/* TOTAL INGREDIENTS */}
                <div className={focusClasses + " card bg-base-200 rounded-xl shadow lg:col-span-2 h-50"}>
                    <div className="card-body overflow-y-auto">
                        <h2 className="card-title text-2xl font-bold mb-4">{t.totalIngredients}</h2>

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