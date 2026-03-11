"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [selectedRecipes, setSelectedRecipes] = useState<SelectedRecipe[]>([]);
  const [showAllIngredients, setShowAllIngredients] = useState(false);
  const [combinedIngredientsState, setCombinedIngredientsState] = useState<any[]>([]);
  const langContext = useLang();
  const lang = langContext?.lang ?? "en";
  const t = SHOPPING_LIST_STRINGS[lang];
  const plannerT = PLANNER_STRINGS[lang];
  const units: Record<string, string> = MEASUREMENT_STRINGS[lang].units;

  // Load saved shopping list from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("shoppingList");
    if (saved) {
      const recipes = JSON.parse(saved);
      setSelectedRecipes(recipes);
      setCombinedIngredientsState(combineIngredients(recipes));
    }
  }, []);

  // Update combined ingredients when selected recipes change
  useEffect(() => {
    setCombinedIngredientsState(combineIngredients(selectedRecipes));
  }, [selectedRecipes]);

  //remove a recipe from shopping list by its id
  const removeRecipe = (id: string) => {
    const updated = selectedRecipes.filter((item) => item.recipe._id !== id);
    setSelectedRecipes(updated);
    localStorage.setItem("shoppingList", JSON.stringify(updated));
  };

  //update the number of servings for a given recipe
  const updateServings = (recipeID: string, servings: number) => {
    const updated = selectedRecipes.map((item) =>
      item.recipe._id === recipeID ? { ...item, servings } : item
    );
    setSelectedRecipes(updated);
    localStorage.setItem("shoppingList", JSON.stringify(updated));
  };

  //clear all selected recipes and combined ingredients
  const clearAll = () => {
    setSelectedRecipes([]);
    setCombinedIngredientsState([]);
    localStorage.removeItem("shoppingList");
  };
  // Remove specific ingredinet form the combined ingredients list
  const removeIngredient = (ingredientId: string) => {
    setCombinedIngredientsState(prev =>
      prev.filter(item => item.ingredient._id !== ingredientId)
    );
  };
  //Total cost of all combined ingredients
  const totalCost = combinedIngredientsState
    .reduce((total, item) => total + item.totalCost, 0)
    .toFixed(2);
  // Number of ingredients to show before "See more "
  const MAX_VISIBLE_INGREDIENTS = 5;

  const visibleIngredients = showAllIngredients
    ? combinedIngredientsState
    : combinedIngredientsState.slice(0, MAX_VISIBLE_INGREDIENTS);

  return (
    <main className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="w-full bg-black flex justify-center py-6">
        <h1 className="text-4xl font-black text-white">{t.title}</h1>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-8">

        {/* Buttons: Clear All, Print Ingredients, Print All Recipes */}
        <div className="flex gap-4 flex-wrap items-center print:flex print:gap-4">
          <button
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 print:hidden"
            onClick={clearAll}
          >
            {t.clearAll}
          </button>
          {/*Print only the combined ingredients */}
          <PrintButton
            targetId="print-ingredients"
            label={lang === "es" ? "Imprimir Ingredientes" : "Print Ingredients"}
            className="px-4 py-2 rounded-md"
          />
          {/*Print all recipes */}
          <PrintButton
            label={lang === "es" ? "Imprimir todas las recetas" : "Print All Recipes"}
            className="px-4 py-2 rounded-md"
          />
        </div>

        {/* Combined Ingredients*/}
        <div
          id="print-ingredients"
          className="bg-base-200 p-6 rounded-xl shadow print:block print:p-0 print:shadow-none print:mt-0"
        >
          <h2 className="text-2xl font-bold mb-4 print:text-black print:text-xl">
            {plannerT.totalIngredients}
          </h2>

          {/* visable ingredients */}
          <ul className="screen-only print:hidden">
            {visibleIngredients.map((item) => (
              <li
                key={item.ingredient._id}
                className="flex justify-start items-center gap-2 p-1 group"
              >
                <span>
                  {decimalToFraction(item.totalAmount, item.ingredient.unit)}{" "}
                  {item.ingredient.unit.toLowerCase() === "each"
                    ? ""
                    : units[item.ingredient.unit?.toLowerCase()] || item.ingredient.unit}{" "}
                  {item.ingredient?.[lang]}
                </span>
                
                {/* samll button "x" to remove ingredient */}
                <button
                  onClick={() => removeIngredient(item.ingredient._id)}
                  className="text-red-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity select-none"
                  title="Remove ingredient"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>

          {/* visible ingredients when printing */}
          <ul className="hidden print:block">
            {combinedIngredientsState.map((item) => (
              <li
                key={item.ingredient._id}
                className="flex justify-start items-center gap-2 p-1">
                {decimalToFraction(item.totalAmount, item.ingredient.unit)}{" "}
                {item.ingredient.unit.toLowerCase() === "each"
                  ? ""
                  : units[item.ingredient.unit?.toLowerCase()] || item.ingredient.unit}{" "}
                {item.ingredient?.[lang]}
              </li>
            ))}
          </ul>
          {/*Toggle to show more ingredients if the list is long */}
          {combinedIngredientsState.length > MAX_VISIBLE_INGREDIENTS && (
            <button
              className="mt-2 text-sm text-blue-600 hover:underline print:hidden"
              onClick={() => setShowAllIngredients(!showAllIngredients)}
            >
              {showAllIngredients
                ? t.seeLess
                : `${t.seeMore} (${combinedIngredientsState.length - MAX_VISIBLE_INGREDIENTS} ${t.more})`}
            </button>
          )}
          {/*Total cost of all ingredients */}
          <div className="mt-4 font-bold print:text-black">
            {t.totalCost}: ${totalCost}
          </div>
        </div>

        {/* Recipe Cards */}
        {selectedRecipes.map((item) => {
          const { recipe, servings } = item;
          // calculate cost based on selected servings 
          const { scaledCost, scaleFactor } = scaleCost(
            recipe.totalCost,
            servings
          );
          // Scale amount of each ingredient according to servings
          const ingredients: string[] = recipe.ingredientPlainText[lang]
            .split("|||")
            .map((ingredient: string) =>
              scaleIngredient(ingredient, scaleFactor)
            );

          return (
            <div
              key={recipe._id}
              className="group block rounded-xl focus:outline-none focus-visible:ring-3 focus-visible:ring-neutral focus-visible:ring-offset-2"
            >
              <div
                className="bg-base-100 shadow-xl rounded-xl p-6 relative flex flex-col md:flex-row print:flex-col hover:shadow-2xl transition-shadow cursor-pointer"
                onClick={() => {
                  const selection = window.getSelection()?.toString();
                  if (!selection) {
                    router.push(`/single-recipe/${recipe._id}`);
                  }
                }}
              >

                {/* Remove button for recipe*/}
                <button
                  className="absolute top-4 right-4 btn btn-sm btn-error print:hidden z-10"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeRecipe(recipe._id);
                  }}
                >
                  {t.remove}
                </button>

                {/* Recipe image */}
                {recipe.imageURI && (
                  <div className="flex-none w-full md:w-60 h-40 rounded-lg overflow-hidden mb-4 md:mb-0 md:mr-6">
                    <img
                      src={recipe.imageURI}
                      alt={recipe.title?.[lang]}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Recipe details */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold">
                    {recipe.title?.[lang]}
                  </h3>

                  <div className="flex gap-2 mt-2 print:flex-col">
                    <span>{t.servings}</span>
                    {/* Servings input */}
                    <input
                      type="number"
                      min={1}
                      value={servings}
                      className="input input-bordered w-20 print:hidden"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateServings(recipe._id, Number(e.target.value));
                      }}
                    />
                  </div>
                  {/*Recipe cost */}
                  <p className="mt-2 font-semibold print:hidden">
                    {t.cost}: ${scaledCost.toFixed(2)}
                  </p>
                  {/*Recipe ingredients */}
                  <ul className="list-disc ml-6 mt-3">
                    {ingredients.map((ingredient, i) => (
                      <li key={i}>{ingredient}</li>
                    ))}
                  </ul>

                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}