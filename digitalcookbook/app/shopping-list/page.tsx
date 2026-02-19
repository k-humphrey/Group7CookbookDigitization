"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ShoppingListPage() {
  const [shoppingList, setShoppingList] = useState<any[]>([]);

  // Load shopping list from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("shoppingList");
    if (saved) {
      setShoppingList(JSON.parse(saved));
    }
  }, []);

  // remove item from shopping list
  const removeItem = (id: string) => {
    const updated = shoppingList.filter((item) => item._id !== id);
    setShoppingList(updated);
    localStorage.setItem("shoppingList", JSON.stringify(updated));
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-start w-full">
      {/* Title */}
      <div className="w-full bg-black flex justify-center py-6">
        <h1 className="text-4xl md:text-5xl font-black text-white leading-none">
          Shopping List
        </h1>
      </div>

      {/* Recipes in Shopping List */}
      <div className="mt-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 px-6 w-full max-w-7xl">
        {shoppingList.length === 0 && (
          <p className="text-center text-slate-600 col-span-full">
            Your shopping list is empty.
          </p>
        )}
        {/*loops over every recipe and creates a card */}
        {shoppingList.map((recipe) => (
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
                    No image
                  </div>
                )}
              </figure>

              <div className="card-body">
                <h2 className="card-title text-lg">{recipe.title}</h2>
              </div>
            </Link>

            {/* Remove button */}
            <button
              className="absolute top-2 right-2 btn btn-sm btn-error"
              onClick={() => removeItem(recipe._id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
