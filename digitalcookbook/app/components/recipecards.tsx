"use client";

import Link from "next/link";
import { useLang } from "@/app/components/languageprovider";
import { useState } from "react";
import Toast from "@/app/components/toast";

interface Props {
  recipes: any[];
}

const STRINGS = {
  en: {
    viewRecipes: "View Recipe"
  },
  es: {
    viewRecipes: "Ver receta"
  }
};
export default function RecipeGrid({ recipes }: Props) {

    const [toastMessage, setToastMessage] = useState("");
    const langContext = useLang();
    const lang = langContext?.lang ?? 'en';
    const t = STRINGS[lang];


  try {
    return (
    <div>
      <div className="mt-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {recipes.map((recipe: any) => (
          <Link key={recipe._id} href={`/single-recipe/${recipe._id}`} className="block">
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              
              {/* Image */}
              <figure className="h-48 overflow-hidden bg-base-200">
                {recipe.imageURI ? (
                  <img
                    src={recipe.imageURI}
                    alt={recipe.title?.[lang] ?? "Recipe image"}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-slate-500">
                    No image
                  </div>
                )}
              </figure>

              {/* Content */}
              <div className="card-body">
                <h2 className="card-title text-lg">
                  {recipe.title?.[lang]}
                </h2>

                <p className="text-sm text-slate-600 line-clamp-3">
                  {recipe.instructions?.[lang]}
                </p>

                {/* Tags */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {(() => {const tagObj = lang === "es" ? (recipe.espTags ?? {}) : (recipe.tags ?? {});
                    return Object.entries(tagObj).filter(([_, value]) => value === true).map(([tag]) => (
                        <div key={tag} className={`badge ${(tag === "Blue Ribbon" || tag === "Cinta Azul") ? "badge-info" : "badge-success"}`}>
                          {tag}
                        </div>
                      ));
                  })()}
                </div>

                <div className="card-actions justify-end mt-4 flex gap-2">
                    {/* View Recipe Button */}
                    <div className="btn btn-sm btn-success">{t.viewRecipes}</div>

                    {/* Add to List Button */}
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={(e) => {
                        e.preventDefault();
                        // prevent navigating to recipe page
                        e.stopPropagation(); 
                        //looks for shooping list in browser
                        const saved = localStorage.getItem("shoppingList");
                        const list = saved ? JSON.parse(saved) : [];
                        //checks if the recipe is already on the list
                        if (!list.find((item: any) => item._id === recipe._id)) {
                          //adds the recipe if its not already on the list
                          list.push({
                            _id: recipe._id,
                            title: recipe.title?.[lang],
                            imageURI: recipe.imageURI,
                          });
                          //saves updated list back to browser
                          localStorage.setItem("shoppingList", JSON.stringify(list));
                          //message
                          setToastMessage(`${recipe.title?.[lang]} added to Shopping List`);
                        }
                      }}
                    >
                      Add to List
                    </button>
                  </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Toast message={toastMessage} onClose={()=> setToastMessage("")}/>
      </div>
    );
  } catch {
    return <p className="mt-6 text-sm text-slate-600" >No recipes found.</p>;
  }
}
