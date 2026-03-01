"use client";

import { useEffect, useState } from "react";
import { scaleCost, scaleIngredient } from "@/lib/scaleRecipe";
import { combineIngredients } from "@/lib/combineIngredients";
import { decimalToFraction } from "@/lib/fractionConverter";
import { useLang } from "@/app/components/languageprovider";
import { PLANNER_STRINGS } from "@/app/meal-planner/plannerStrings";
import { MEASUREMENT_STRINGS } from "@/app/measurement-converter/measurementStrings";
import { SHOPPING_LIST_STRINGS } from "./shoppingListStrings";
import { SelectedRecipe } from "@/app/meal-planner/page";
import PrintButton from "@/app/components/printbutton";

export default function ShoppingListPage() {
  // store recipes selected by the user
  const [selectedRecipes, setSelectedRecipes] = useState<SelectedRecipe[]>([]);
  //show all ingredients or limited list
  const [showAllIngredients, setShowAllIngredients] = useState(false);

  const langContext = useLang();
  const lang = langContext?.lang ?? "en";

  const t = SHOPPING_LIST_STRINGS[lang];
  const plannerT = PLANNER_STRINGS[lang];
  const units: Record<string, string> = MEASUREMENT_STRINGS[lang].units;

  //load saved shopping list from localStorage 
  useEffect(() => {
    const saved = localStorage.getItem("shoppingList");
    if (saved) setSelectedRecipes(JSON.parse(saved));
  }, []);

  //remove recipe from a shooping list and update localStorage
  const removeRecipe = (id: string) => {
    const updated = selectedRecipes.filter((item) => item.recipe._id !== id);
    setSelectedRecipes(updated);
    localStorage.setItem("shoppingList", JSON.stringify(updated));
  };
  //update servings for recipe
  const updateServings = (recipeID: string, servings: number) => {
    const updated = selectedRecipes.map((item) =>
      item.recipe._id === recipeID ? { ...item, servings } : item
    );
    setSelectedRecipes(updated);
    localStorage.setItem("shoppingList", JSON.stringify(updated));
  };
  //Clear all recipes from shopping list
  const clearAll = () => {
    setSelectedRecipes([]);
    localStorage.removeItem("shoppingList");
  };
  //Combine all ingredients form selected recipes
  const combinedIngredients = combineIngredients(selectedRecipes);
  //total cost of all ingredients 
  const totalCost = combinedIngredients
    .reduce((total, item) => total + item.totalCost, 0)
    .toFixed(2);
  //number of visible ingredients before "See More"
  const MAX_VISIBLE_INGREDIENTS = 5;
  const visibleIngredients = showAllIngredients
    ? combinedIngredients
    : combinedIngredients.slice(0, MAX_VISIBLE_INGREDIENTS);

  return (
    <main className="min-h-screen bg-base-100">

      {/* Header */}
      <div className="w-full bg-black flex justify-center py-6">
        <h1 className="text-4xl font-black text-white">{t.title}</h1>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-8">

        {/*Buttons: Clear All and Print Ingredients */}
        <div className="flex gap-4 flex-wrap items-center print:flex print:gap-4">
          {/* Clear All */}
          <button
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 print:hidden"
            onClick={clearAll}
          >
            {t.clearAll}
          </button>

          {/* Print Ingredients */}
          <PrintButton
            targetId="print-ingredients"
            label={lang === "es" ? "Imprimir Ingredientes" : "Print Ingredients"}
            className="px-4 py-2 rounded-md"
          />
        </div>

        {/* Combined Ingredients Box */}
        <div
          id="print-ingredients"
          className="bg-base-200 p-6 rounded-xl shadow print:block print:p-0 print:shadow-none print:mt-0"
        >
          <h2 className="text-2xl font-bold mb-4 print:text-black print:text-xl">
            {plannerT.totalIngredients}
          </h2>

          {/* Visible ingredients */}
          <ul className="space-y-2 screen-only print:hidden">
            {visibleIngredients.map((item, index) => (
              <li key={index}>
                {decimalToFraction(item.totalAmount, item.ingredient.unit)}{" "}
                {units[item.ingredient.unit?.toLowerCase()] || item.ingredient.unit}{" "}
                {item.ingredient?.[lang]}
              </li>
            ))}
          </ul>

          {/* Print all ingredients */}
          <ul className="hidden space-y-2 print:block">
            {combinedIngredients.map((item, index) => (
              <li key={index}>
                {decimalToFraction(item.totalAmount, item.ingredient.unit)}{" "}
                {units[item.ingredient.unit?.toLowerCase()] || item.ingredient.unit}{" "}
                {item.ingredient?.[lang]}
              </li>
            ))}
          </ul>

          {/* See More or See Less button  */}
          {combinedIngredients.length > MAX_VISIBLE_INGREDIENTS && (
            <button
              className="mt-2 text-sm text-blue-600 hover:underline print:hidden"
              onClick={() => setShowAllIngredients(!showAllIngredients)}
            >
              {showAllIngredients
                ? t.seeLess
                : `${t.seeMore} (${combinedIngredients.length - MAX_VISIBLE_INGREDIENTS} ${t.more})`}
            </button>
          )}

          {/* Total Cost */}
          <div className="mt-4 font-bold print:text-black">
            {t.totalCost}: ${totalCost}
          </div>
        </div>

        {/* Recipe Cards */}
        {selectedRecipes.map((item) => {
          const { recipe, servings } = item;
          const { scaledCost, scaleFactor } = scaleCost(recipe.totalCost, servings);

          const ingredients: string[] = recipe.ingredientPlainText[lang]
            .split("|||")
            .map((ingredient: string) =>
              scaleIngredient(ingredient, scaleFactor)
            );

          return (
            <div key={recipe._id} className="bg-base-100 shadow-xl rounded-xl p-6 relative flex flex-col md:flex-row print:flex-col">

              {/* Remove Recipe Button */}
              <button
                className="absolute top-4 right-4 btn btn-sm btn-error print:hidden"
                onClick={() => removeRecipe(recipe._id)}
              >
                {t.remove}
              </button>

              {/* Recipe Image */}
              {recipe.imageURI && (
                <div className="flex-none w-full md:w-60 h-40 rounded-lg overflow-hidden mb-4 md:mb-0 md:mr-6">
                  <img
                    src={recipe.imageURI}
                    alt={recipe.title?.[lang]}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Recipe Details */}
              <div className="flex-1">
                <h3 className="text-xl font-bold">
                  {recipe.title?.[lang]}
                </h3>

                <div className="flex gap-2 mt-2 print:flex-col">
                  <span>{t.servings}</span>
                  <input
                    type="number"
                    min={1}
                    value={servings}
                    className="input input-bordered w-20 print:hidden"
                    onChange={(e) =>
                      updateServings(recipe._id, Number(e.target.value))
                    }
                  />
                </div>

                <p className="mt-2 font-semibold print:hidden">
                  ${scaledCost.toFixed(2)}
                </p>

                <ul className="list-disc ml-6 mt-3">
                  {ingredients.map((ingredient, i) => (
                    <li key={i}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}