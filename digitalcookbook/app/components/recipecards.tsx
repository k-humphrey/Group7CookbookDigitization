"use client";

import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/app/components/languageprovider";
import { useState } from "react";
import Toast from "@/app/components/toast";
import { Recipe, SelectedRecipe } from "@/app/meal-planner/page";

interface Props {
  recipes: Recipe[];
}

const STRINGS = {
  en: {
    viewRecipes: "View Recipe",
    saveRecipe: "Save Recipe",
    addToShopping: "Add to Shopping"
  },
  es: {
    viewRecipes: "Ver receta",
    saveRecipe: "Guardar receta",
    addToShopping: "Agregar a compras"
  }
};

export default function RecipeGrid({ recipes }: Props) {

  const [toastMessage, setToastMessage] = useState("");
  const langContext = useLang();
  const lang = langContext?.lang ?? 'en';
  const t = STRINGS[lang];

  return (
    <div>
      <div className="mt-6 mr-3 grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {recipes.map((recipe) => (
          <Link key={recipe._id} href={`/single-recipe/${recipe._id}`} className="block">
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow flex flex-col">
              
              <figure className="h-48 overflow-hidden bg-base-200">
                {recipe.imageURI ? (
                  <Image
                    src={recipe.imageURI.trimEnd()}
                    alt={recipe.title?.[lang] ?? "Recipe image"}
                    loading="lazy"
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-slate-500">
                    No image
                  </div>
                )}
              </figure>

              <div className="card-body flex-1 flex flex-col -m-1">
                <h2 className="card-title text-lg line-clamp-2 min-h-14">
                  {recipe.title?.[lang]}
                </h2>

                <div className="card-actions justify-end mt-2 flex gap-2">

                  <div className="btn btn-sm btn-success">
                    {t.viewRecipes}
                  </div>

                  {/* SAVE RECIPE */}
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      const saved = localStorage.getItem("savedRecipe");
                      const list = saved ? JSON.parse(saved) : [];

                      if (!list.find((item: any) => item._id === recipe._id)) {
                        list.push({
                          _id: recipe._id,
                          title: recipe.title,
                          imageURI: recipe.imageURI,
                        });

                        localStorage.setItem("savedRecipe", JSON.stringify(list));
                        setToastMessage(`${recipe.title?.[lang]} added to Saved Recipe`);
                      }
                    }}
                  >
                    {t.saveRecipe}
                  </button>

                  {/* ADD TO SHOPPING */}
                  <button
                    className="btn btn-sm btn-secondary"
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

      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
    </div>
  );
}