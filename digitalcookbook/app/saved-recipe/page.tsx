"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLang } from "@/app/components/languageprovider";
import { SAVED_RECIPE_STRINGS } from "./savedRecipeStrings";

export default function SavedRecipePage() {
  const [savedRecipe, setSavedRecipe] = useState<any[]>([]);

  const langContext = useLang();
  const lang = langContext?.lang ?? "en";
  const t = SAVED_RECIPE_STRINGS[lang];
  // Load saved recipe from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("savedRecipe");
    if (saved) {
      setSavedRecipe(JSON.parse(saved));
    }
  }, []);

  // remove item from saved recipe
  const removeItem = (id: string) => {
    const updated = savedRecipe.filter((item) => item._id !== id);
    setSavedRecipe(updated);
    localStorage.setItem("savedRecipe", JSON.stringify(updated));
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-start w-full">
      {/* Title */}
      <div className="w-full bg-black flex justify-center py-6">
        <h1 className="text-4xl md:text-5xl font-black text-white leading-none">
          {t.title}
        </h1>
      </div>

      {/* Recipes in saved recipe */}
      <div className="mt-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 px-6 w-full max-w-7xl">
        {savedRecipe.length === 0 && (
          <p className="text-center text-slate-600 col-span-full">
            {t.empty}
          </p>
        )}
        {/*loops over every recipe and creates a card */}
        {savedRecipe.map((recipe) => (
          <div key={recipe._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow relative">
            {/* Clickable image or title to go to single-recipe page */}
            <Link href={`/single-recipe/${recipe._id}`} className="block">
              <figure className="h-48 overflow-hidden bg-base-200">
                {recipe.imageURI ? (
                  <img
                    src={recipe.imageURI}
                    alt={recipe.title ?? "Recipe image"}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-slate-500">
                   {t.noImage}
                  </div>
                )}
              </figure>

              <div className="card-body">
                <h2 className="card-title text-lg">
                  {recipe.title?.[lang] ?? recipe.title?.en}

                </h2>
              </div>
            </Link>

            {/* Remove button */}
            <button
              className="absolute top-2 right-2 btn btn-sm btn-error"
              onClick={() => removeItem(recipe._id)}
            >
              {t.remove}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
