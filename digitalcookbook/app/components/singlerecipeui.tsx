// app/components/singlerecipeui.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useLang } from "./languageprovider";
import { scaleCost, scaleIngredient } from "@/lib/scaleRecipe";
import RecipeActions from "./recipeActions"; // <- NEW
// Removed direct PrintButton import because it's now inside RecipeActions

type Recipe = {
  _id: string;
  title?: { en?: string; es?: string };
  ingredientPlainText?: { en?: string; es?: string };
  instructions?: { en?: string; es?: string };
  imageURI?: string;
  tags?: {
    'Blue Ribbon'?: boolean;
    vegan?: boolean;
    vegetarian?: boolean;
  };
  totalCost?: number;
  allergens?: Record<string, boolean>;
  espAllergens?: Record<string, boolean>;
  espTags?: Record<string, boolean>;
};

const STRINGS = {
  en: {
    prep: "Prep Time:",
    cook: "Cook Time:",
    servings: "Servings:",
    total: "Total Cost: $",
    ing: "Ingredients",
    contains: "This recipe contains the following allergens:",
    servingsLabel: "Servings",
    tagsLabel: "Tags",
    allergensLabel: "Allergens",
    noImage: "No image",
    noIngredients: "No ingredients listed.",
    directions: "Directions (4 Servings)",
    noDirections: "No directions provided."
  },
  es: {
    prep: "Tiempo de preparación:",
    cook: "Tiempo de cocción:",
    servings: "Porciones:",
    total: "Costo total: $",
    ing: "Ingredientes",
    contains: "Esta receta contiene:",
    servingsLabel: "Porciones",
    tagsLabel: "Etiquetas",
    allergensLabel: "Alérgenos",
    noImage: "Sin imagen",
    noIngredients: "No hay ingredientes listados.",
    directions: "Instrucciones",
    noDirections: "No se proporcionaron instrucciones."
  },
};

export default function SingleRecipeUI({ recipe }: { recipe: Recipe }) {
  const langContext = useLang();
  const lang = langContext?.lang ?? 'en';
  const title = recipe?.title?.[lang] ?? "Recipe";
  const t = STRINGS[lang];
  const allergenField = lang === "es" ? "espAllergens" : "allergens";
  const allergensObj = (recipe as any)?.[allergenField] as Record<string, boolean> | undefined;

   // State for servings, default to 4
  const [servings, setServings] = useState(4);

  // Calculate scaled cost based on servings
  const {scaleFactor, scaledCost} = recipe?.totalCost != null
    ? scaleCost(recipe.totalCost, servings)
    : {scaleFactor: 1, scaledCost: 0.00};

  // Log recipe page visit
  useEffect(() => {
    // Load already visited recipes
    const visitedRecipes = JSON.parse(sessionStorage.getItem("visitedRecipes") || "{}");

    // if recipe already visited, skip
    if (visitedRecipes[recipe._id])
      return;
    else { // else, store recipe as visited (true) in session storage
      visitedRecipes[recipe._id] = true;
      sessionStorage.setItem("visitedRecipes", JSON.stringify(visitedRecipes));
    }
    
    // Log recipe page visit
    fetch("/api/trackVisit", {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({ recipeId: recipe._id })
    }).catch((error) => console.log("Failed to log recipe visit: ", error));
    
  }, [recipe._id]);

  return (
    <section className="min-h-screen bg-base-100">
      <div className="mx-auto max-w-6xl px-6 pt-6 printable print:block">
        <div className="border border-base-300 bg-base-100">
          
          {/* IMAGE */}
          <div className="h-90 w-full overflow-hidden bg-base-200 print:flex print:justify-center relative">
            {recipe?.imageURI ? (
              <Image
                src={recipe.imageURI.trimEnd()}
                alt={title}
                fill
                className="object-cover print:mx-auto print:block"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-base-content/60">
                {t.noImage}
              </div>
            )}
          </div>

          {/* TITLE + TAGS */}
          <div className="p-4 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <h1 className="text-lg font-bold leading-tight wrap-break-word">
                {title}
              </h1>

              <ul aria-label={t.tagsLabel} className="flex flex-wrap items-center gap-2 text-sm">
                {(() => {const tagObj = lang === "es" ? (recipe.espTags ?? {}) : (recipe.tags ?? {});
                  return Object.entries(tagObj).filter(([_, value]) => value === true).map(([tag]) => (
                      <li key={tag} className={`badge ${(tag === "Blue Ribbon" || tag === "Cinta Azul") ? "badge-info" : "badge-success"}`}>
                        {tag}
                      </li>
                    ));
                })()}
              </ul>
            </div>

            {/* ROW 2: TIME, SERVINGS, COST, ACTIONS */}
            <div className="flex flex-row items-end justify-between mt-24">
              <div className="md:flex md:flex-row items-start md:gap-10 grid print:flex print:flex-row print:gap-10 print:items-start">
                <div className="font-semibold">{t.prep}</div>
                <div className="font-semibold">{t.cook}</div>
                <div className="font-semibold -mt-0.5">
                  <label htmlFor="servings-input">
                    {t.servings}
                  </label>
                  <input
                    id="servings-input"
                    type="number"
                    min={0}
                    step={1}
                    value={servings || ""}
                    placeholder="0"
                    onChange={(e) => setServings(Number(e.target.value))}
                    className="ml-2 w-16 input input-sm input-bordered focus:outline-none focus-visible:ring-3 focus-visible:ring-offset-2 focus-visible:ring-primary focus-visible:rounded-md"
                    aria-label={t.servingsLabel}
                  />
                </div>
                <span className="font-semibold">{t.total}{scaledCost.toFixed(2)}</span>
              </div>

              {/* ACTION BUTTONS */}
              <RecipeActions recipe={recipe} servings={servings} />
            </div>

            {/* Divider */}
            <div className="mt-4 border-t border-base-900" />
          </div>

          {/* ALLERGENS */}
          <ul aria-label={t.allergensLabel} className="px-6 pb-4 flex flex-wrap gap-2">
            <span className="font-semibold">{t.contains}</span>

            {allergensObj && Object.entries(allergensObj).filter(([, value]) => value === true).map(([allergen]) => (
                <li key={allergen} className="badge badge-error font-semibold text-black">{allergen}</li>
              ))}
          </ul>

          {/* Directions and Ingredients */}
          <section className="flex flex-col-reverse sm:flex-row justify-between print:flex-col">

            {/* Directions */}
            <div className="p-4 flex">
              <section className="rounded-lg bg-[#dfe8d8] p-4 w-full print:w-auto print:h-auto">
                <h2 className="text-lg lg:text-2xl font-bold mb-3 text-center">{t.directions}</h2>
                <ul className="pt-4 space-y-3 text-sm leading-relaxed list-decimal pl-6">
                  {recipe?.instructions?.[lang] ? (
                    recipe.instructions?.[lang].split("|||").map((line, i) =>
                      <li key={i} className="wrap-break-words">{line}</li>
                    )
                  ) : (
                    <li className="text-base-content/60">{t.noDirections}</li>
                  )}
                </ul>
              </section>
            </div>

            {/* Ingredients */}
            <div className="py-4 pr-4 flex justify-center sm:justify-right">
              <section className="rounded-lg bg-[#f0f0f0] p-4 w-auto print:w-auto print:h-auto">
                <h2 className="text-lg lg:text-2xl font-bold mb-3 text-center">{t.ing}</h2>
                <ul className="mt-4 space-y-2 text-sm leading-relaxed">
                  {recipe?.ingredientPlainText?.[lang] ? (
                    recipe.ingredientPlainText?.[lang].split("|||").map((line, i) =>
                      <li key={i} className="flex gap-2">
                        <span className="text-primary font-extrabold">•</span>
                        <span className="wrap-break-words">{scaleIngredient(line.trim(), scaleFactor)}</span>
                      </li>
                    )
                  ) : (
                    <li className="text-base-content/60">{t.noIngredients}</li>
                  )}
                </ul>
              </section>
            </div>

          </section>
        </div>
      </div>
    </section>
  );
}