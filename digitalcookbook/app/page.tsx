// Home page

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Searchbar from "./components/searchbar";
import RecipeGrid from "./components/recipecards";  
import { useLang } from "@/app/components/languageprovider";

const STRINGS = {
  en: {
    thrifyBites: "Thrifty Bites",
    search: "Search by ingredients you have or find the perfect recipe",
    featured: "Featured Recipes",
  },
  es: {
    thrifyBites: "Bocados Económicos",
    search: "Busca por ingredientes que tienes o encuentra la receta perfecta",
    featured: "Recetas Destacadas",
  },
};

export default function Home() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<any[]>([]);
  const langContext = useLang();
  const lang = langContext?.lang ?? 'en';
  const t = STRINGS[lang];

  // routes to the recipes page
  const handleSearch = (tags: string[]) => {
    if(tags)
      router.push(`/recipes?ingredients=${tags.join(",")}`);
    else
      router.push('/recipes');
  };

  // fetch all recipes
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/recipes");
      const data = await res.json();
      setRecipes(data);
    })();
  }, []);

  // select 3 random recipes
  const featuredRecipes = useMemo(() => {
    return recipes.length
      ? [...recipes].sort(() => Math.random() - 0.5).slice(0, 3)
      : [];
  }, [recipes]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-start">

      {/* Background picture */}
      <div 
        className="w-full bg-cover bg-center bg-no-repeat py-30 flex flex-col items-center"  
        style={{
          backgroundSize: "110%", 
          backgroundImage: "url('/searchbackground.jpg')"
          }}
      >

        {/* Logo + Subtitle */}
        <div className="text-center mb-5">
          <h1 className="text-6xl md:text-[5rem] font-black text-slate-950 leading-none">{t.thrifyBites}</h1>

          <p className="mt-5 pt-5 text-base max-w-3xl md:text-2xl text-slate-950">{t.search}</p>
        </div>

        {/* Searchbar */}
        <Searchbar onSearch={handleSearch} />
      

        {/* Featured Recipes */}
        <section className="w-full max-w-7xl px-6 mt-40 mb-20">
          <h2 className="text-4xl font-bold mb-6 flex justify-center">{t.featured}</h2>
          <RecipeGrid recipes={featuredRecipes} />
        </section> 
      </div> 
    </main>
  );
}