//app/components/singlerecipeui.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useLang } from "./languageprovider";
import { scaleCost, scaleIngredient } from "@/lib/scaleRecipe";
import PrintButton from "@/app/components/printbutton";

type Recipe = {
  _id: string;
  title?: { en?: string; es?: string };
  ingredientPlainText?: { en?: string; es?: string };
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
    contains: "This Recipe Contains:",
    servingsLabel: "Servings",
    tagsLabel: "Tags",
    allergensLabel: "Allergens",
    noImage: "No image",
    noIngredients: "No ingredients listed.",
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
  const {scaleFactor, scaledCost} = recipe?.totalCost != null ? scaleCost(recipe.totalCost, servings) : {scaleFactor: 1, scaledCost: 0.00};

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
    <section className="min-h-screen bg-base-100 ">
      <div className="mx-auto max-w-6xl px-6 pt-6 printable print:block">
        <div className="border border-base-300 bg-base-100">
          
          {/* Image */}
          <div className="h-48 w-full overflow-hidden bg-base-200 print:flex print:justify-center relative">
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

          {/* Title + Tags */}
          <div className="p-4 sm:p-6">
            {/* Row 1: Title + Tags */}
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

            {/* Row 2: Time, Servings, and Cost */}
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
                <span className="font-semibold">
                  {t.total}
                  {scaledCost.toFixed(2)}
                </span>
              </div>
              {/*Print Button */}
                <div className="print:hidden">
                  <PrintButton label={lang === "es" ? "Imprimir Receta" : "Print Recipe"} />
                </div>
            </div> 

          {/* Divider */}
          <div className="mt-4 border-t border-base-900" />
          </div>

          {/* Allergens */}
          <ul aria-label={t.allergensLabel} className="px-6 pb-4 flex flex-wrap gap-2">
            <span className="font-semibold">{t.contains}</span>
            
            {allergensObj && Object.entries(allergensObj).filter(([_, value]) => value === true).map(([allergen]) => (
                  <li key={allergen} className="text-black font-bold">{allergen}</li>
                ))}
          </ul> 

          {/* Ingredients */}
          <div className="p-6 flex justify-left">
            <section className="rounded-lg bg-[#dfe8d8] p-4 w-auto print:w-auto"> 
              <h2 className="text-center text-md font-bold tracking-wide">{t.ing}</h2>
              <ul className="mt-3 list-disc list-inside space-y-1 pl-5 text-sm ">
                {recipe?.ingredientPlainText?.[lang] ? (
                  recipe.ingredientPlainText?.[lang]
                    .split("|||")
                    .map((line, i) => 
                      <li key={i} className="wrap-break-words">{scaleIngredient(line.trim(), scaleFactor)}</li>
                    )
                ) : (
                  <li className="text-base-content/60">{t.noIngredients}</li>
                )}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}