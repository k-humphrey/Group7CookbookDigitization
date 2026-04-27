"use client";

import { useLang } from "@/app/components/languageprovider";
import { useState } from "react"
import { combineIngredients, SelectedRecipe } from "@/lib/combineIngredients";
import { ingredientShoppingConverter } from "@/lib/ingredientShoppingConverter";
import { IngredientPriceInfo } from "@/app/api/ingredients/byIDsGetIngredientPriceInfo/route";
import { generateCSV } from "@/lib/generateCSV";
import { scaleCost } from "@/lib/scaleRecipe";
import { decimalToFraction } from "@/lib/fractionConverter";
import { PLANNER_STRINGS } from "@/app/meal-planner/plannerStrings";
import { MEASUREMENT_STRINGS } from "@/app/measurement-converter/measurementStrings"; 

// Components
import RecipeBreakdownCard from "@/app/components/recipeBreakdownCard";
import Toast from "@/app/components/toast";

// Pass in selected recipes
interface Props {
    selectedRecipes: SelectedRecipe[];
    setSelectedRecipes: React.Dispatch<React.SetStateAction<SelectedRecipe[]>>;
    ingredientPriceInfo: Record<string, IngredientPriceInfo>;
}

const focusClasses = "focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral focus-visible:ring-offset-1 rounded";

// Component to show summary of selected recipes, total costs, and scaled ingredients
export default function PlanSummary({ selectedRecipes, setSelectedRecipes, ingredientPriceInfo }: Props) {
    // Lang settings
    const langContext = useLang();
    const lang = langContext?.lang ?? 'en';
    const t = PLANNER_STRINGS[lang];
    const units: Record<string, string> = MEASUREMENT_STRINGS[lang].units;

    // Toast for adding to shopping list
    const [toastMessage, setToastMessage] = useState("");

    // Combine ingredients and calculate totals
    const combinedIngredients = combineIngredients(selectedRecipes);
    const totalServings = selectedRecipes.reduce((total, item) => total + item.servings, 0);
    const totalRecipesCost = selectedRecipes.reduce((total, {recipe, servings}) => total + scaleCost(recipe.totalCost, servings).scaledCost, 0).toFixed(2);
    
    // Calculate Shopping List Ingredients and total shopping cost
    const shoppingListIngredients = ingredientShoppingConverter(combinedIngredients, ingredientPriceInfo, lang);

    // Render summary of plan totals and breakdown for each selected recipe
    return (
        <div className="mt-15 gap-3 flex flex-col">
            <div className="flex md:justify-end justify-center gap-0.5 md:gap-0">
                {/* Clear All Button*/}
                <button
                className={focusClasses + " btn btn-error md:mr-2 md:btn-md btn-sm"}
                onClick={() => {
                    setSelectedRecipes([]);                // clear recipes state
                    sessionStorage.removeItem("plannerRecipes"); // clear session storage
                }}
                >
                    {t.clearAll}
                </button>
                {/* Add to Shopping List Button */}
                <button
                className={focusClasses + " btn btn-primary md:mr-2 md:btn-md btn-sm"}
                onClick={() => {
                    const saved = localStorage.getItem("shoppingList");
                    const list: SelectedRecipe[] = saved ? JSON.parse(saved) : [];

                    selectedRecipes.forEach((item) => {
                        if(!list.find((existing) => existing.recipe._id === item.recipe._id))
                            list.push(item);
                    });

                    localStorage.setItem("shoppingList", JSON.stringify(list));
                    setToastMessage(`Plan added to Shopping List`);

                }}
                >
                    {t.addToShopping}
                </button>
                {/* Export to CSV Button */}
                <button onClick={() => generateCSV(combinedIngredients, selectedRecipes, lang, "IngredientList.csv")} className={focusClasses + " btn btn-warning md:btn-md btn-sm"}>
                    {t.exportCSV}
                </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

                {/* PLAN TOTALS */}
                <section aria-label={t.planTotalsSection} className={focusClasses + " card bg-base-200 rounded-xl shadow lg:col-span-1 h-50"} tabIndex={0}>
                    <div className="card-body text-lg overflow-y-auto">
                        <h2 className="card-title text-2xl font-bold mb-4">{t.planTotals}</h2>

                        <ul>
                            <li>{t.totalServings}: <b>{totalServings}</b></li>
                            <li>{t.totalCost}: <b>${totalRecipesCost}</b></li>
                            <li>{t.totalShoppingCost}: <b>${shoppingListIngredients.totalShoppingCost.toFixed(2)}</b></li>
                        </ul>
                    </div>
                </section>

                {/* TOTAL INGREDIENTS */}
                <section aria-label={t.totalIngredientsSection} className={focusClasses + " card bg-base-200 rounded-xl shadow lg:col-span-2 h-50"} tabIndex={0}>
                    <div className="card-body overflow-y-auto">
                        <h2 className="card-title text-2xl font-bold mb-4">{t.totalIngredients}</h2>

                        <ul className="list-disc ml-6 space-y-2">
                            {combinedIngredients.map((item) => (
                                <li key={item.ingredient.ingredient}>
                                    <b>{decimalToFraction(item.totalAmount, item.ingredient.unit)} {item.ingredient.unit.toLowerCase() === "each" ? "" : units[item.ingredient.unit?.toLowerCase()] || item.ingredient.unit} {item.ingredient?.[lang] ?? item.ingredient.ingredient}</b>
                                    {(item.ingredient.unit !== "g") && <> — ${item.totalCost.toFixed(2)}</>}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </div>

            {/* RECIPE BREAKDOWN CARDS */}
            <section aria-label={t.recipeBreakdownCardsSection} className="hidden md:block">
            {selectedRecipes.map((item) => {
                return (
                    <RecipeBreakdownCard
                        key={item.recipe._id}
                        selectedRecipe={item}
                    />
                );
            })}
            </section>
            <Toast aria-live="polite" message={toastMessage} onClose={() => setToastMessage("")}/>
        </div>
    );
}