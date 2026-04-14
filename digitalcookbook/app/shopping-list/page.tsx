"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { scaleCost, scaleIngredient } from "@/lib/scaleRecipe";
import { combineIngredients, SelectedRecipe } from "@/lib/combineIngredients";
import { ingredientShoppingConverter } from "@/lib/ingredientShoppingConverter";
import { IngredientPriceInfo } from "../api/ingredients/byIDsGetIngredientPriceInfo/route";
import { useLang } from "@/app/components/languageprovider";
import { MEASUREMENT_STRINGS } from "@/app/measurement-converter/measurementStrings";
import { SHOPPING_LIST_STRINGS } from "./shoppingListStrings";
import PrintButton from "@/app/components/printbutton";
import { decimalToFraction } from "@/lib/fractionConverter";
import { generateCSV } from "@/lib/generateCSV";

export default function ShoppingListPage() {
  const router = useRouter();
  const [selectedRecipes, setSelectedRecipes] = useState<SelectedRecipe[]>([]);
  // Load checkbox state from localStorage
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("checkedIngredients");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const [showAllIngredients, setShowAllIngredients] = useState(false);
  const [shoppingState, setShoppingState] = useState<{combinedIngredients: any[];ingredientPriceInfo: Record<string, IngredientPriceInfo>;}>({combinedIngredients: [],ingredientPriceInfo: {},});
  const { combinedIngredients, ingredientPriceInfo } = shoppingState;
  const langContext = useLang();
  const lang = langContext?.lang ?? "en";
  const t = SHOPPING_LIST_STRINGS[lang];
  const units: Record<string, string> = MEASUREMENT_STRINGS[lang].units;

  // Load saved shopping list from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("shoppingList");
    if (saved) {
      const recipes = JSON.parse(saved);
      setSelectedRecipes(recipes);
    }
  }, []);

  // Save checkbox state to localStorage
  useEffect(() => {
    localStorage.setItem("checkedIngredients", JSON.stringify(checkedIngredients));
  }, [checkedIngredients]);

  // Update combined ingredients when selected recipes change and get ingredient price info
  useEffect(() => {
    if (selectedRecipes.length === 0) 
      return;

    const combinedIngredients = combineIngredients(selectedRecipes);
    setShoppingState({combinedIngredients: combinedIngredients,ingredientPriceInfo: {},});

    fetch(`/api/ingredients/byIDsGetIngredientPriceInfo?ids=${Array.from(new Set(selectedRecipes.flatMap((recipes) =>recipes.recipe.ingredients.map((ingredient) => ingredient.ingredient)))).filter(Boolean).join(",")}`)
      .then((res) => res.json())
      .then((data: Record<string, IngredientPriceInfo>) => setShoppingState({combinedIngredients: combinedIngredients,ingredientPriceInfo: data,}));
  }, [selectedRecipes]);

  // Initialize checkbox state only when new ingredients appear
  useEffect(() => {
    if (!shoppingState.combinedIngredients.length) 
      return;
    const newState = { ...checkedIngredients };
    let changed = false;

    shoppingState.combinedIngredients.forEach((item) => {
      const name = item.ingredientName;
      if (name && newState[name] === undefined) {
        // default checked
        newState[name] = true; 
        changed = true;
      }
    });

    if (changed) 
      setCheckedIngredients(newState);
  }, [shoppingState.combinedIngredients]);

  //remove a recipe from shopping list by its id
  const removeRecipe = (id: string) => {
    const updated = selectedRecipes.filter((item) => item.recipe._id !== id);
    setSelectedRecipes(updated);
    localStorage.setItem("shoppingList", JSON.stringify(updated));
  };

  //update the number of servings for a given recipe
  const updateServings = (recipeID: string, servings: number) => {
    const updated = selectedRecipes.map((item) => {
      if (servings < 1) 
        servings = 1;
      return item.recipe._id === recipeID ? { ...item, servings } : item;
    });
    setSelectedRecipes(updated);
    localStorage.setItem("shoppingList", JSON.stringify(updated));
  };

  //clear all selected recipes and combined ingredients
  const clearAll = () => {
    setSelectedRecipes([]);
    setShoppingState({ combinedIngredients: [], ingredientPriceInfo: {} });
    localStorage.removeItem("shoppingList");
    localStorage.removeItem("checkedIngredients");
    setCheckedIngredients({});
  };

  // Toggle ingredientName
  const toggleIngredient = (name: string) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // Convert to shopping list
  const shoppingList = ingredientShoppingConverter(combinedIngredients,ingredientPriceInfo,lang);
  //Total cost of all shoppingList Items
  const totalCost = shoppingList.totalShoppingCost.toFixed(2);
  // Number of ingredients to show before "See more "
  const MAX_VISIBLE_INGREDIENTS = 5;

  const visibleIngredients = showAllIngredients
    ? shoppingList.shoppingList
    : shoppingList.shoppingList.slice(0, MAX_VISIBLE_INGREDIENTS);

  return (
    <main className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="w-full bg-black flex justify-center py-6">
        <h1 className="text-4xl font-black text-white">{t.title}</h1>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-8">

        {/* Buttons */}
        <div className="flex gap-4 flex-wrap items-center print:flex print:gap-4">
          <button
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 print:hidden"
            onClick={clearAll}
          >
            {t.clearAll}
          </button>
          {/*Print only the shopping list ingredients */}
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
          {/*Generate CSV Button*/}
          <button 
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 print:hidden"
            onClick={() => generateCSV(combinedIngredients, selectedRecipes, lang, "shopping-list.csv")}
          >
            {t.generateCSV}
          </button>
        </div>

        {/* Shopping List ingredients*/}
        <div
          id="print-ingredients"
          className="bg-base-200 p-6 rounded-xl shadow print:block print:p-0 print:shadow-none print:mt-0"
        >
          <h2 className="text-2xl font-bold mb-4 print:text-black print:text-xl">
            {t.ingredientShoppingList}
          </h2>

          {/* Check All and Uncheck All */}
          <div className="flex gap-4 mb-3 screen-list-only">
            <button
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
              onClick={() => {
                const all: Record<string, boolean> = {};
                shoppingList.shoppingList.forEach((item) => {
                  all[item.ingredientName] = true;
                });
                setCheckedIngredients(all);
              }}
            >
              Check All
            </button>

            <button
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
              onClick={() => {
                const none: Record<string, boolean> = {};
                shoppingList.shoppingList.forEach((item) => {
                  none[item.ingredientName] = false;
                });
                setCheckedIngredients(none);
              }}
            >
              Uncheck All
            </button>
          </div>

          {/* visible screen list */}
          <div className="screen-list-only">
            <ul>
              {visibleIngredients.filter((ingredient) => ingredient.ingredientName).map((item) => {
                  const name = item.ingredientName;
                  return (
                    <li
                      key={name}
                      className="flex justify-start items-center gap-2 p-1"
                    >
                      <input type="checkbox" checked={checkedIngredients[name] !== false}onChange={() => toggleIngredient(name)}/>

                      <span>
                        {item.packagesNeeded > 0 && `${decimalToFraction(item.packagesNeeded,units[name])} x ${item.storeName}`}
                        {item.totalCost > 0 && ` - $${item.totalCost.toFixed(2)}`}
                      </span>
                    </li>
                  );
                })}
            </ul>

            {/*Toggle to show more ingredients if the list is long */}
            {shoppingList.shoppingList.length > MAX_VISIBLE_INGREDIENTS && (
              <button className="mt-2 text-sm text-blue-600 hover:underline" 
              onClick={() => setShowAllIngredients(!showAllIngredients)}
              >
                {showAllIngredients
                  ? t.seeLess
                  : `${t.seeMore} (${
                      shoppingList.shoppingList.length - MAX_VISIBLE_INGREDIENTS
                    } ${t.more})`}
              </button>
            )}

            {/* total cost in print */}
            <div className="mt-4 font-bold">
              {t.totalCost}: ${totalCost}
            </div>
          </div>

          {/* Print list */}
          <ul className="print-list hidden print:block">
            {shoppingList.shoppingList
              .filter((item) => checkedIngredients[item.ingredientName] !== false)
              .map((item) => (
                <li key={item.ingredientName} className="flex gap-2 p-1">
                  {item.packagesNeeded > 0 &&
                    `${decimalToFraction(
                      item.packagesNeeded,
                      units[item.ingredientName]
                    )} x ${item.storeName}`}
                </li>
              ))}
          </ul>
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
          const ingredients: string[] = recipe.ingredientPlainText?.[lang] ? recipe.ingredientPlainText[lang].split("|||").map((ingredient: string) => scaleIngredient(ingredient, scaleFactor)) : (recipe?.ingredients || []).map((ing: any) => { 
              return (ing.unit || "") === "each" ? scaleIngredient(`${(ing.amount || 0)} ${(ing?.[lang] || "")}`.trim(), scaleFactor) :
                scaleIngredient(`${(ing.amount || 0)} ${(ing.unit || "")} ${(ing?.[lang] || "")}`.trim(), scaleFactor);
            });

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
                {/* Remove button for recipe card*/}
                <button
                  className="absolute top-4 right-4 btn btn-sm btn-error screen-list-only z-10 print:hidden"
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

                  <div className="flex gap-2 mt-2 screen-list-only">
                    <span>{t.servings}</span>
                    {/* Servings input */}
                    <input
                      type="number"
                      min={1}
                      value={servings}
                      className="input input-bordered w-20"
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateServings(recipe._id, Number(e.target.value));
                      }}
                    />
                  </div>
                  {/*Recipe cost */}
                  <p className="mt-2 font-semibold screen-list-only">
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
