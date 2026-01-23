"use client";

import Link from "next/link";
interface Props {
  recipes: any[];
}

export default function RecipeGrid({ recipes }: Props) {
  try {
    return (
      <div className="mt-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {recipes.map((recipe: any) => (
          <div key={recipe._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            
            {/* Image */}
            <figure className="h-48 overflow-hidden bg-base-200">
              {recipe.imageURI ? (
                <img
                  src={recipe.imageURI}
                  alt={recipe.title?.en ?? "Recipe image"}
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
                {recipe.title?.en}
              </h2>

              <p className="text-sm text-slate-600 line-clamp-3">
                {recipe.instructions?.en}
              </p>

              {/* Tags */}
              <div className="mt-3 flex flex-wrap gap-2">
                {recipe.tags?.blueRibbon && (
                  <div className="badge badge-info">Blue Ribbon</div>
                )}
                {recipe.tags?.vegan && (
                  <div className="badge badge-success">Vegan</div>
                )}
                {recipe.tags?.vegetarian && (
                  <div className="badge badge-success">Vegetarian</div>
                )}
              </div>

              <div className="card-actions justify-end mt-4">
                <Link href={`/single-recipe/${recipe._id}`} className="btn btn-sm btn-success">
                View Recipe
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  } catch {
    return <p className="mt-6 text-sm text-slate-600" >No recipes found.</p>;
  }
}
