"use client";

import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/app/components/languageprovider";
import { useState } from "react";
import Toast from "@/app/components/toast";
import { SelectedRecipe } from "@/lib/combineIngredients";

interface Props {
  recipes: any[];
}

const STRINGS = {
  en: {
    viewRecipes: "View Recipe",
    noRecipes: "No recipes found.",
    saveRecipe: "Save Recipe",
    addToShopping: "Add to Shopping"
  },
  es: {
    viewRecipes: "Ver receta",
    noRecipes: "No se encontraron recetas.",
    saveRecipe: "Guardar receta",
    addToShopping: "Agregar a compras"
  }
};
export default function RecipeGrid({ recipes }: Props) {

  const [toastMessage, setToastMessage] = useState("");
  const langContext = useLang();
  const lang = langContext?.lang ?? 'en';
  const t = STRINGS[lang];

  if (!recipes || recipes.length === 0) {
    return <p className="mt-6 text-sm text-slate-600">{t.noRecipes}</p>;
  }

  return (
  <div>
    <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {recipes.map((recipe: any) => (
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
            <div className="card-body flex-1 flex flex-col -m-1">
              <h2 className="card-title text-lg line-clamp-2 min-h-14">
                {recipe.title?.[lang]}
              </h2>

              {/* Tags */}
              <div className="mt-1 flex flex-wrap gap-2 min-h-7">
                {(() => {const tagObj = lang === "es" ? (recipe.espTags ?? {}) : (recipe.tags ?? {});
                  return Object.entries(tagObj).filter(([_, value]) => value === true).map(([tag]) => (
                      <div key={tag} className={`badge ${(tag === "Blue Ribbon" || tag === "Cinta Azul") ? "badge-info" : "badge-success"}`}>
                        {tag}
                      </div>
                    ));
                })()}
              </div>

              <div className="mt-2 lg:flex lg:flex-row lg:flex-nowrap grid grid-cols-2 gap-2 justify-end">
                  {/* View Recipe Button */}
                  <span className="btn btn-sm btn-success pointer-events-none group-focus-visible:ring-3 group-focus-visible:ring-neutral group-focus-visible:ring-offset-2">{t.viewRecipes}</span>

                  {/* Add to saved recipe */}
                  <button
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
                        setToastMessage(`${recipe.title?.[lang]} added to Saved Recipe`);
                      }
                    }}
                  >
                    {t.saveRecipe}
                  </button>
                  {/* ADD TO SHOPPING */}
                  <button
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
                        setToastMessage(`${recipe.title?.[lang]} added to Shopping List`);
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
