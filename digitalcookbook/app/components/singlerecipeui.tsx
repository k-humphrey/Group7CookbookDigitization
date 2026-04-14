// app/components/singlerecipeui.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useLang } from "@/app/components/languageprovider";
import { scaleCost, scaleIngredient } from "@/lib/scaleRecipe";
import RecipeActions from "@/app/components/recipeActions";

type Recipe = {
  _id: string;
  title?: { en?: string; es?: string };
  ingredientPlainText?: { en?: string; es?: string };
  ingredients?: any[];
  instructions?: { en?: string; es?: string };
  imageURI?: string;
  tags?: {
    "Blue Ribbon"?: boolean;
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
    ingSub: "Tap each one as you add it!",
    gathered: "gathered",
    contains: "This recipe contains the following allergens:",
    servingsLabel: "Servings",
    tagsLabel: "Tags",
    allergensLabel: "Allergens",
    noImage: "No image",
    noIngredients: "No ingredients listed.",
    directions: "Directions",
    dirSub: "Tap each step when done",
    noDirections: "No directions provided.",
    doneMsg: "You made it! Great job, chef! Time to eat! 🍽️",
  },
  es: {
    prep: "Tiempo de preparación:",
    cook: "Tiempo de cocción:",
    servings: "Porciones:",
    total: "Costo total: $",
    ing: "Ingredientes",
    ingSub: "¡Toca cada uno al agregarlo!",
    gathered: "reunidos",
    contains: "Esta receta contiene:",
    noImage: "Sin imagen",
    noIngredients: "No hay ingredientes listados.",
    directions: "Instrucciones",
    dirSub: "Toca cada paso cuando termines",
    noDirections: "No se proporcionaron instrucciones.",
    doneMsg: "¡Lo lograron! ¡Buen trabajo, chef! ¡A comer! 🍽️",
  },
};
const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <polyline
      points="2,6 5,9 10,3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function SingleRecipeUI({ recipe }: { recipe: Recipe }) {
  const langContext = useLang();
  const lang = langContext?.lang ?? "en";
  const title = recipe?.title?.[lang] ?? "Recipe";
  const t = STRINGS[lang];
  const allergenField = lang === "es" ? "espAllergens" : "allergens";
  const allergensObj = (recipe)?.[allergenField] as Record<string, boolean> | undefined;

  const [servings, setServings] = useState(4);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());

  const {scaleFactor, scaledCost} = recipe?.totalCost != null
    ? scaleCost(recipe.totalCost, servings)
    : {scaleFactor: 1, scaledCost: 0.00};

  const ingredients = recipe?.ingredientPlainText?.[lang]
    ? recipe.ingredientPlainText[lang]!.split("|||").map((l) => l.trim())
    : (recipe?.ingredients || []).map((ing: any) => { 
      return (ing.unit || "") === "each" ? `${(ing.amount || 0)} ${(ing?.[lang] || "")}`.trim() : `${(ing.amount || 0)} ${(ing.unit || "")} ${(ing?.[lang] || "")}`.trim();
    });

  const steps = recipe?.instructions?.[lang]
    ? recipe.instructions[lang]!.split("|||").map((l) => l.trim())
    : [];

  const toggleIngredient = (i: number) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
      }
      return next;
    });
  };

  const toggleStep = (i: number) => {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
      }
      return next;
    });
  };

  const showDone =
    ingredients.length > 0 &&
    steps.length > 0 &&
    checkedIngredients.size === ingredients.length &&
    checkedSteps.size === steps.length;

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
    <section className="min-h-screen bg-base-100 bg-cover bg-center" style={{backgroundImage: "url('/singlerecipebg.png')"}}>
      <div className="mx-auto max-w-6xl p-6 printable print:block">
        <div className="rounded-xl border border-black/20 bg-base-100">

          {/* IMAGE */}
          <div className="rounded-t-xl h-90 w-full overflow-hidden bg-base-200 print:flex print:justify-center relative">
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

              <ul className="flex flex-wrap items-center gap-2 text-sm">
                {(() => {
                  const tagObj = lang === "es" ? (recipe.espTags ?? {}) : (recipe.tags ?? {});
                  return Object.entries(tagObj).filter(([, value]) => value === true).map(([tag]) => {
                      const isBlueRibbon = tag === "Blue Ribbon" || tag === "Cinta Azul";
                      return (
                        <li key={tag}>
                          {isBlueRibbon ? (
                            <Image
                              src="/blueribbon2.png"   // put this image in /public
                              alt="Blue Ribbon"
                              width={38}
                              height={38}
                              className="drop-shadow-sm -mt-2"
                            />
                          ) : (
                            <span className="badge badge-success">
                              {tag}
                            </span>
                          )}
                        </li>
                      );
                    });
                })()}
              </ul>
            </div>

            {/* ROW 2: TIME, SERVINGS, COST, ACTIONS */}
            <div className="flex flex-row items-end justify-between mt-10">
              <div className="md:flex md:flex-row items-start md:gap-10 grid print:flex print:flex-row print:gap-10 print:items-start">
                
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
          <div className="flex flex-row pl-6 gap-2">
            <span className="font-semibold">{t.contains}</span>
            <ul className="pr-6 pb-10 flex flex-wrap gap-2">
              {allergensObj && Object.entries(allergensObj).filter(([, value]) => value === true).map(([allergen]) => (
                <li key={allergen} className="badge badge-error font-semibold text-black">{allergen}</li>
              ))}
            </ul>
          </div>

          {/* INGREDIENTS + DIRECTIONS */}
          <div className="p-4 sm:p-6 space-y-6">

            {/* INGREDIENTS */}
            <div>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <h2 className="text-lg lg:text-2xl font-bold -mt-10">{t.ing}</h2>
                  <p className="text-xs font-semibold mt-0.5 text-black/60">
                    {t.ingSub}
                  </p>
                </div>
                <span className="text-sm font-bold text-black/60">
                  {checkedIngredients.size} / {ingredients.length} {t.gathered}
                </span>
              </div>

              {/* Progress bar */}
              <progress
                className="progress w-full mb-3 bg-base-200 [&::-webkit-progress-value]:bg-[#23B13B] [&::-moz-progress-bar]:bg-[#23B13B]"
                value={checkedIngredients.size}
                max={ingredients.length}
              />

              {/* Ingredient card grid */}
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 list-none">
                {ingredients.length > 0 ? (
                  ingredients.map((line, i) => {
                    const checked = checkedIngredients.has(i);
                    const scaledLine = scaleIngredient(line, scaleFactor);
                    if(line.length > 0) {
                      return (
                        <li key={i}>
                          <button
                            type="button"
                            onClick={() => toggleIngredient(i)}
                            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-all cursor-pointer w-full border ${checked ? "bg-[#EAF3DE] border-[#3B6D11]" : "bg-base-100 border-base-300 hover:border-[#3B6D11]/50"}`}>
                            <div
                              className={`text-white shrink-0 w-5 h-5 flex items-center justify-center rounded-md border-2 transition-all ${checked ? "bg-[#23B13B] border-base-300" : "bg-base-100 border-base-300"}`}>
                              {checked && <CheckIcon />}
                            </div>
                            <span className={`text-sm font-semibold leading-snug wrap-break-words ${checked ? "line-through text-base-content/40" : "text-base-content"}`}>
                              {scaledLine}
                            </span>
                          </button>
                        </li>
                      );
                    }
                  })
                ) : (
                  <li className="text-sm text-base-content/60 col-span-full">
                    {t.noIngredients}
                  </li>
                )}
              </ul>
            </div>

            {/* DIRECTIONS */}
            <div className="rounded-2xl overflow-hidden border border-base-300">

              {/* Header */}
              <div className="px-5 py-4 flex items-center justify-between bg-[#DFE8D8]">
                <h2 className="text-lg lg:text-2xl font-bold text-black">
                  {t.directions}
                  <span className="ml-2 text-sm font-semibold text-black/60">
                    ({servings} {lang === "es" ? "porciones" : "servings"})
                  </span>
                </h2>
                <span className="text-xs font-semibold hidden sm:block text-black/60">
                  {t.dirSub}
                </span>
              </div>

              <ol className="divide-y divide-base-200 list-none">
                {steps.length > 0 ? (
                  steps.map((line, i) => {
                    const done = checkedSteps.has(i);
                    if(line.length > 0) {
                      return (
                        <li key={i}>
                          <button
                            type="button"
                            onClick={() => toggleStep(i)}
                            className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-all cursor-pointer ${
                              done ? "bg-[#EAF3DE]" : "bg-base-100 hover:bg-base-200"
                            }`}
                          >
                            {/* Step number badge */}
                            <div
                              className={`shrink-0 w-8 h-8 mt-0.5 flex items-center justify-center rounded-lg text-sm font-black text-black ${
                                done ? "text-white bg-[#23B13B]" : "bg-[#DFE8D8]"}`}>
                              {i + 1}
                            </div>

                            <div className="flex-1">
                              <p
                                className={`text-sm leading-relaxed wrap-break-words ${done ? "line-through text-base-content/40" : "text-base-content"}`}>
                                {line}
                              </p>
                            </div>

                            {/* Visual tick */}
                            <div
                              className={`text-white shrink-0 w-5 h-5 flex items-center justify-center rounded-full mt-1 border-2 transition-all ${
                                done ? "bg-[#23B13B] border-[#23B13B]" : "bg-base-100 border-base-300"}`}>
                              {done && <CheckIcon />}
                            </div>
                          </button>
                        </li>
                      );
                    }
                  })
                ) : (
                  <li className="text-sm text-base-content/60 px-5 py-4">
                    {t.noDirections}
                  </li>
                )}
              </ol>
            </div>

            {/* NOTES */}
            <div className="rounded-2xl overflow-hidden border border-base-600 mt-6 p-4 sm:p-6 bg-base-100">
              <h2 className="text-lg lg:text-2xl font-bold text-black mb-2">
                Notes
              </h2>
              <p className="text-xs text-black/60 mb-4">
                Add any personal notes or tips for this recipe.
              </p>

              <p className="w-full p-4 rounded-xl border-base-300 focus:outline-none focus:ring-2 focus:ring-primary resize-none"></p>
              <p className="w-full p-4 rounded-xl border-base-300 focus:outline-none focus:ring-2 focus:ring-primary resize-none"></p>
              <p className="w-full p-4 rounded-xl border-base-300 focus:outline-none focus:ring-2 focus:ring-primary resize-none"></p>
              
            </div>

            {/* COMPLETION MESSAGE */}
            {showDone && (
              <div className="rounded-2xl text-center px-6 py-4 font-black text-lg bg-[#EAF3DE] border border-[#3B6D11] text-green-700 print:hidden">
                {t.doneMsg}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}