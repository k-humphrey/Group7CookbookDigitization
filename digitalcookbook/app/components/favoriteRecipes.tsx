"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/app/components/languageprovider";

// string lang conversions
const STRINGS = {
  en: {
    title: "Top 10 Recipes This Month",
    loading: "Loading",
    views: "Views"
  },
  es: {
    title: "Las 10 Mejores Recetas de este Mes",
    loading: "Cargando",
    views: "Vistos"
  },
} as const;

// type for favorite recipes
type FavRecipe = {
    recipeId: string;
    title: { en: string; es: string };
    monthlyViewCount: number;
};

// Component to show top 10 recipes
export default function FavoriteRecipes() {
    const [recipes, setRecipes] = useState<FavRecipe[]>([]);

    // lang settings
    const langContext = useLang();
    const lang = langContext?.lang || "en";

    // fetch favorite recipes from db
    useEffect(() => {
        fetch("/api/recipes/favorites")
        .then(res => res.json())
        .then(data => setRecipes(data));
    }, []);

    return (
        <div className="card p-2 border shadow-md rounded-lg h-full w-full relative flex">
            <h2 className="text-lg font-bold mb-2 text-center">{STRINGS?.[lang].title}</h2>
            <ul className="list-disc pl-6 card-body">
                {recipes.length === 0 ? (
                    <p className="text-center">{STRINGS?.[lang].loading}...</p>
                ) : recipes.map(recipe => (
                    <li key={recipe.recipeId}>
                        {`${recipe.title?.[lang]} - ${STRINGS?.[lang].views}: ${recipe.monthlyViewCount}`}
                    </li>
                ))}
            </ul>
        </div>
    );
}
