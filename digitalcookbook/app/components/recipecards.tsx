"use client";

import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/app/components/languageprovider";
import { useState } from "react";
import Toast from "@/app/components/toast";
import { SelectedRecipe } from "@/lib/combineIngredients";

interface Props {
  recipes: any[];
  loading?: boolean;
}

const STRINGS = {
  en: {
    viewRecipes: "View Recipe",
    loadingRecipes: "Loading...",
    noRecipes: "No Recipes",
    saveRecipe: "Save Recipe",
    addToShopping: "Add to Shopping",
    addedRecipeSaved: "added to Saved Recipes",
    addedRecipeShopping: "added to Shopping List"
  },
  es: {
    viewRecipes: "Ver receta",
    loadingRecipes: "Cargando...",
    noRecipes: "Sin Recetas",
    saveRecipe: "Guardar receta",
    addToShopping: "Agregar a compras",
    addedRecipeSaved: "Añadido a la receta guardada",
    addedRecipeShopping: "Añadido a la lista compra"
  }
};
export default function RecipeGrid({ recipes, loading }: Props) {

  const [toastMessage, setToastMessage] = useState("");
  const langContext = useLang();
  const lang = langContext?.lang ?? 'en';
  const t = STRINGS[lang];

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
      {(recipes || []).map((recipe: any) => (
        <Link key={recipe._id} href={`/single-recipe/${recipe._id}`} className="group block focus:outline-none focus-visible:ring-3 focus-visible:ring-neutral focus-visible:ring-offset-1 rounded" aria-label={`View recipe ${recipe.title?.[lang]}`}>
          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow flex flex-col">
            
            {/* Image */}
            <figure className="h-48 overflow-hidden bg-base-200 relative">
              {recipe.imageURI ? (
                <Image
                  src={recipe.imageURI.trimEnd()}
                  alt={recipe.title?.[lang] ?? "Recipe image"}
                  loading="lazy"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover"
                />
              ) : (
                <div aria-hidden="true" className="w-full h-full flex items-center justify-center text-sm text-slate-500">
                  No image
                </div>
              )}
            </figure>

            {/* Content */}
            <div className="card-body flex-1 flex flex-col -m-2">
              <h2 className="card-title text-lg line-clamp-2 min-h-14">
                {recipe.title?.[lang]}
              </h2>

              {/* Tags */}
              <div className="mt-1 flex flex-wrap items-center gap-2 min-h-[57px]">
                {(() => {
                  const tagObj = lang === "es" ? (recipe.espTags ?? {}) : (recipe.tags ?? {});

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

              <div className="mt-2 lg:flex lg:flex-row lg:flex-nowrap grid grid-cols-2 gap-2 justify-end">
                  {/* View Recipe Button */}
                  <span className="btn btn-sm btn-success pointer-events-none group-focus-visible:ring-3 group-focus-visible:ring-neutral group-focus-visible:ring-offset-2">{t.viewRecipes}</span>

                  {/* Add to saved recipe */}
                  <button
                    type="button"
                    className="btn btn-sm btn-primary focus:outline-none focus-visible:ring-3 focus-visible:ring-neutral focus-visible:ring-offset-2"
                    onClick={(e) => {
                      e.preventDefault();
                      // prevent navigating to single recipe page
                      e.stopPropagation(); 
                      //looks for saved recipe in browser
                      const saved = localStorage.getItem("savedRecipe");
                      const list = saved ? JSON.parse(saved) : [];
                      //checks if the recipe is already on the saved recipe
                      if (!list.find((item: any) => item._id === recipe._id)) {
                        //adds the recipe if its not already on the saved recipe
                        list.push({
                          _id: recipe._id,
                          title: recipe.title?.[lang],
                          imageURI: recipe.imageURI,
                        });
                        //saves updated list back to browser
                        localStorage.setItem("savedRecipe", JSON.stringify(list));
                        //message
                        setToastMessage(`${recipe.title?.[lang]} ${t.addedRecipeSaved}`);
                      }
                    }}
                  >
                    {t.saveRecipe}
                  </button>
                  {/* ADD TO SHOPPING */}
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary focus:outline-none focus-visible:ring-3 focus-visible:ring-neutral focus-visible:ring-offset-2"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      const saved = localStorage.getItem("shoppingList");
                      const list: SelectedRecipe[] = saved ? JSON.parse(saved) : [];

                      if (!list.find((item) => item.recipe._id === recipe._id)) {
                        list.push({
                          recipe: recipe,
                          servings: 4
                        });

                        localStorage.setItem("shoppingList", JSON.stringify(list));
                        setToastMessage(`${recipe.title?.[lang]} ${t.addedRecipeShopping}`);
                      }
                    }}
                  >
                    {t.addToShopping}
                  </button>

                </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
    <Toast aria-live="polite" message={toastMessage} onClose={()=> setToastMessage("")}/>
    </div>
  );
}
