"use client";

import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/app/components/languageprovider";
import { useEffect, useState } from "react";
import Toast from "@/app/components/toast";
import { SelectedRecipe } from "@/lib/combineIngredients";

interface Props {
  recipes: any[];
  loading?: boolean;
}

const STRINGS = {
  en: {
    loadingRecipes: "Loading...",
    noRecipes: "No Recipes",
    addedRecipeSaved: "added to Saved Recipes",
    addedRecipePlanner: "added to Meal Planner",
    removedSaved: "removed from Saved Recipes",
    removedPlanner: "removed from Meal Planner",
    saveRecipe: "Save recipe",
    addToPlanner: "Add to Planner",
    removeFromPlanner: "Remove",
  },
  es: {
    loadingRecipes: "Cargando...",
    noRecipes: "Sin Recetas",
    addedRecipeSaved: "Añadido a la receta guardada",
    addedRecipePlanner: "Añadido al planificador",
    removedSaved: "eliminado de guardados",
    removedPlanner: "eliminado del planificador",
    saveRecipe: "Guardar receta",
    addToPlanner: "Agregar al planificador",
    removeFromPlanner: "Eliminar",
  },
};

export default function RecipeGrid({ recipes, loading }: Props) {
  // Toast message after save or remove actions
  const [toastMessage, setToastMessage] = useState("");
  // Maps used for fast lookup
  const [isSavedMap, setIsSavedMap] = useState<Record<string, boolean>>({});
  const [isPlannerMap, setIsPlannerMap] = useState<Record<string, boolean>>({});

  const langContext = useLang();
  const lang = langContext?.lang ?? "en";
  const t = STRINGS[lang];
  // Load saved and planner state from the browser storage when recipes change
  useEffect(() => {
    // Retrieve saved recipes from localStorage
    const saved = localStorage.getItem("savedRecipe");
    const savedList = saved ? JSON.parse(saved) : [];
    // Retrieve planner recipes from sessionStorage
    const planner = sessionStorage.getItem("plannerRecipes");
    const plannerList = planner ? JSON.parse(planner) : [];
    const savedMap: Record<string, boolean> = {};
    const plannerMap: Record<string, boolean> = {};

    // Mark saved recipes
    savedList.forEach((item: any) => {
      savedMap[item._id] = true;
    });
    // Mark planner
    plannerList.forEach((item: any) => {
      plannerMap[item.recipe._id] = true;
    });
    // Store maps in state for UI rendering
    setIsSavedMap(savedMap);
    setIsPlannerMap(plannerMap);
  }, [recipes]);
  // If there is no recipe, show loading state
  if (loading) {
    return (
      <div className="flex min-h-[60vh] w-full flex-col items-center justify-start pt-24 gap-2 text-gray-700">
        <span className="loading loading-spinner loading-xl scale-200"></span>
        <p className="text-sm">{t.loadingRecipes}</p>
      </div>
    );
  } else if(!recipes || recipes.length === 0) {
    return (
      <div className="flex min-h-[60vh] w-full flex-col items-center justify-start pt-24 gap-2 text-gray-700">
        <p className="text-sm">{t.noRecipes}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {/* Loop through all recipes and render a card for each one */}
        {recipes.map((recipe: any) => (
          <Link key={recipe._id} href={`/single-recipe/${recipe._id}`} className="group block focus:outline-none focus-visible:ring-3 focus-visible:ring-neutral focus-visible:ring-offset-1 rounded">
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow flex flex-col min-w-[180px]">

              {/* IMAGE */}
              <figure className="h-48 overflow-hidden bg-base-200 relative">
                {recipe.imageURI ? (
                  <Image
                    src={recipe.imageURI.trimEnd()}
                    alt={recipe.title?.[lang] ?? "Recipe image"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  // fallback if no image exists
                  <div className="w-full h-full flex items-center justify-center text-sm text-slate-500"> No image </div>
                )}
              </figure>

              {/* CONTENT */}
              <div className="card-body flex-1 flex flex-col -m-2">
                 {/* Title */}
                <h2 className="card-title text-lg line-clamp-2 min-h-14"> {recipe.title?.[lang]} </h2>

                {/* TAGS */}
                <div className="mt-1 flex flex-wrap items-center gap-2 min-h-[57px]">
                  {(() => {
                    const tagObj = lang === "es" ? recipe.espTags ?? {} : recipe.tags ?? {};

                    return Object.entries(tagObj).filter(([, value]) => value === true).map(([tag]) => {
                        const isBlueRibbon = tag === "Blue Ribbon" || tag === "Cinta Azul";
                        return (
                          <div key={tag}>
                            {isBlueRibbon ? (
                              <Image
                                src="/blueribbon2.png"
                                alt="Blue Ribbon"
                                width={38}
                                height={38}
                                className="drop-shadow-sm shrink-0"
                              />
                            ) : (
                              <span className="badge badge-success">
                                {tag}
                              </span>
                            )}
                          </div>
                        );
                      });
                  })()}
                </div>
                {/* Action Buttons */}
                <div className="mt-2 flex justify-end gap-2">

                  {/* BOOKMARK / SAVE */}
                  <div className="tooltip tooltip-bottom" data-tip={t.saveRecipe}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault(); // prevent navigation to recipe page
                        e.stopPropagation(); // prevent Link click trigger
                        // Load saved recipes from storage
                        const saved = localStorage.getItem("savedRecipe");
                        const list = saved ? JSON.parse(saved) : [];
                        // Check if recipe already exists
                        const index = list.findIndex(
                          (item: any) => item._id === recipe._id
                        );
                         // Copy current UI state map
                        const updated = { ...isSavedMap };

                        // REMOVE from saved list
                        if (index !== -1) {
                          list.splice(index, 1);
                          updated[recipe._id] = false;
                          setToastMessage(
                            `${recipe.title?.[lang]} ${t.removedSaved}`
                          );
                        } else {
                          list.push({
                            _id: recipe._id,
                            title: recipe.title?.[lang],
                            imageURI: recipe.imageURI,
                          });
                          updated[recipe._id] = true;
                          setToastMessage(
                            `${recipe.title?.[lang]} ${t.addedRecipeSaved}`
                          );
                        }
                        localStorage.setItem("savedRecipe", JSON.stringify(list)); // Persist updated list
                        setIsSavedMap(updated); // Update UI state
                      }}
                      className="h-10 w-10 flex items-center justify-center rounded-lg active:scale-95 transition cursor-pointer"
                    >
                      {/* Show solid or empty bookmark based on state */}
                      {isSavedMap[recipe._id] ? (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-black">
                          <path d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"/>
                        </svg>
                      ) : (
                        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-700">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"/>
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* PLANNER BUTTON */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();  
                      // Load planner list from sessionStorage
                      const saved = sessionStorage.getItem("plannerRecipes");
                      const list: SelectedRecipe[] = saved ? JSON.parse(saved) : [];
                      // Check if recipe is already in planner
                      const index = list.findIndex((item) => item.recipe._id === recipe._id);
                      const updated = { ...isPlannerMap };
                      // REMOVE from planner
                      if (index !== -1) {
                        list.splice(index, 1);
                        updated[recipe._id] = false;
                        setToastMessage(
                          `${recipe.title?.[lang]} ${t.removedPlanner}`
                        );
                      } else { // ADD to planner
                        list.push({ recipe, servings: 4, });
                        updated[recipe._id] = true;
                        setToastMessage(
                          `${recipe.title?.[lang]} ${t.addedRecipePlanner}`
                        );
                      }
                      // Save updated planner list
                      sessionStorage.setItem("plannerRecipes", JSON.stringify(list));
                      setIsPlannerMap(updated); // Update UI state
                    }}
                    className={`h-10 px-3 btn btn-sm flex items-center cursor-pointer transition max-w-26 
                      ${isPlannerMap[recipe._id] ? "btn-error text-black" : "btn-success text-black" }`} >
                    {/* Button label changes based on state */}
                    {isPlannerMap[recipe._id] ? t.removeFromPlanner : t.addToPlanner}
                  </button>

                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {/* Toast notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
    </div>
  );
}