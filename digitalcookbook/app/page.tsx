// Home page

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Searchbar from "@/app/components/searchbar";
import RecipeGrid from "@/app/components/recipecards";  
import { useLang } from "@/app/components/languageprovider";
import Image from "next/image";

const STRINGS = {
  en: {
    thrifyBites: "Thrifty Bites",
    search: "Search by ingredients you have or find the perfect recipe",
    featured: "Featured Recipes",
    skipToSearch: "Skip to search",
    skipToFeatured: "Skip to featured recipes",
    loading: "Loading..."
  },
  es: {
    thrifyBites: "Mordidas Económicos",
    search: "Busca por ingredientes que tienes o encuentra la receta perfecta",
    featured: "Recetas Destacadas",
    skipToSearch: "Saltar a búsqueda",
    skipToFeatured: "Saltar a recetas destacadas",
    loading: "Cargando..."
  },
};

export default function Home() {
  const router = useRouter();
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [featuredRecipes, setFeaturedRecipes] = useState<any[] | null>(null);
  const langContext = useLang();
  const lang = langContext?.lang ?? 'en';
  const t = STRINGS[lang];
  const [sessionTags, setSessionTags] = useState<any[]>([]);

  // routes to the recipes page
  const handleSearch = (tags: string[]) => {
    sessionStorage.setItem("recipeIngredients", JSON.stringify(tags || []));

    router.push('/recipes');
  };

  // load suggestions, load session, and load featured recipes
  useEffect(() => {
    // get last session to restore
    setSessionTags(JSON.parse(sessionStorage.getItem("recipeIngredients") || "[]"));

    // fetch ingredients
    (async () => {
      const res = await fetch("/api/ingredients");
      const data = await res.json();
      if(data)
        setIngredients(data);
    })();

    // fetch featured recipes
    fetch("/api/recipes/featured")
    .then(res => res.json())
    .then(data => {
      if(data?.recipes)
        setFeaturedRecipes(data.recipes);
    })

  }, []);

  const ingredientSuggestions = [
    ...new Set(Array.isArray(ingredients) ?
      ingredients.map((ingredient: any) =>
        ingredient?.[lang].replace(/\(.*?\)/g, "").replace(/\s*[-–—]\s*.*/, "").trim()
      ) : []
    )
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden">
      <a href="#searchbar" className="sr-only">
        {t.skipToSearch}
      </a>
      <a href="#featured-recipes" className="sr-only">
        {t.skipToFeatured}
      </a>

      {/* Background picture */}
      <Image
        src="/searchbackground2.0.webp"
        alt=""
        fill
        priority
        className="object-cover scale-110"
      />

      {/* Logo + Subtitle */}
      <div className="text-center mb-5 z-10">
        <h1 className="text-6xl md:text-[5rem] font-black text-slate-950 leading-none">{t.thrifyBites}</h1>

        <p className="mt-5 pt-5 text-base max-w-3xl md:text-2xl text-slate-950">{t.search}</p>
      </div>

      <div id="searchbar" className="w-11/12 w-md-full z-10">
        {/* Searchbar */}
        <Searchbar key={sessionTags.join(",")} onSearch={handleSearch} initialTags={sessionTags} suggestionsSource={ingredientSuggestions} />
      </div>

      {/* Featured Recipes */}
      <section id="featured-recipes" aria-label={t.featured} className="w-full max-w-7xl px-6 mt-40 mb-20 z-10">
        <h2 className="text-4xl font-bold mb-6 flex justify-center">{t.featured}</h2>
        {featuredRecipes === null ? (
          <p>{t.loading}</p>
        ) : (
          <RecipeGrid recipes={featuredRecipes} />
        )}
      </section>  
    </section>
  );
}
