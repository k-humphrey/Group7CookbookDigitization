"use client";

import Link from "next/link";
import { useLang } from "@/app/components/languageprovider";
interface Props {
  recipes: any[];
}

const STRINGS = {
  en: {
    viewRecipes: "View Recipe"
  },
  es: {
    viewRecipes: "Ver receta"
  },
};
export default function RecipeGrid({ recipes }: Props) {
  try {
    const langContext = useLang();
    const lang = langContext?.lang ?? 'en';
    const t = STRINGS[lang];
    return (
      <div className="mt-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {recipes.map((recipe: any) => (
          <Link href={`/single-recipe/${recipe._id}`} className="block">
            <div key={recipe._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              
              {/* Image */}
              <figure className="h-48 overflow-hidden bg-base-200">
                {recipe.imageURI ? (
                  <img
                    src={recipe.imageURI}
                    alt={recipe.title?.[lang] ?? "Recipe image"}
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
                  {recipe.tags && Object.entries(recipe.tags).filter(([_, value]) => value == true).map(([tag]) => (
                    <div key={tag} className={`badge ${tag == "Blue Ribbon" ? "badge-info" : "badge-success"}`}>
                      {tag}
                    </div>
                  ))}
                </div>

                <div className="card-actions justify-end mt-4">
                  <div className="btn btn-sm btn-success">{t.viewRecipes}</div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  } catch {
    return <p className="mt-6 text-sm text-slate-600" >No recipes found.</p>;
  }
}
