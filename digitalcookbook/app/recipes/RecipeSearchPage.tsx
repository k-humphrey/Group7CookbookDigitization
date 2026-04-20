// Recipes Page

"use client";

import { useEffect } from "react";
import { useLang } from "../components/languageprovider";
import { useRecipeSearch } from "@/hooks/useRecipeSearch";
import Image from "next/image";

// Components
import Filters from "@/app/components/filters";
import RecipeGrid from "@/app/components/recipecards";
import Searchbar from "@/app/components/searchbar";

export default function RecipeSearchPage() {
  const langContext = useLang();
  const lang = langContext?.lang ?? 'en';

  // Session storage for ingredients and filters
  const sessionIngredients = typeof window !== "undefined" ? sessionStorage.getItem("recipeIngredients") : null;
  const sessionFilters = typeof window !== "undefined" ? sessionStorage.getItem("recipeFilters") : null;

  // custom hook for recipe search and pagination logic
  const { recipes, handleSearch, setIngredients, setFilters, pageInfoRef, filtersRef, ingredientsRef, loading } = useRecipeSearch(lang);

  // Initial loading for page
  useEffect(() => {
    // Set ingredients based on url params and session storage
    if(sessionIngredients)
      setIngredients(JSON.parse(sessionIngredients));

    // Set filters based on session storage
    if(sessionFilters)
      setFilters(JSON.parse(sessionFilters));

    // new Search
    handleSearch(false);
  }, []);

  // Scroll listener: check to see if user scrolls to bottom of page
  useEffect(() => {
    const checkScroll = () => {
      window.requestAnimationFrame(() => {
        const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 500; // 500px from bottom
        
        // if nearBottom and not loading then load new recipes
        if(nearBottom && !pageInfoRef.current.isLocked)
          handleSearch(true);
        })
    };

    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => window.removeEventListener("scroll", checkScroll);

  }, []);

  const ingredientSuggestions = [
    ...new Set(
      recipes.flatMap((r: any) =>
        r.ingredients?.map((i: any) =>
          (typeof i === "string" ? i : i[lang]).replace(/\(.*?\)/g, "").trim()
        ) || []
      )
    )
  ];

  return (
    <section>

      <a href="#recipes" className="sr-only">Skip to recipes</a>

      {/* Background Image */}
      <div className="relative w-full py-5 flex flex-col items-center">

        {/* Background picture */}
        <Image
          src="/searchbackground2.0.webp"
          alt=""
          fill
          priority
          className="object-cover scale-110"
        />

        <div className="w-11/12 w-md-full z-10">
          <Searchbar suggestionsSource={ingredientSuggestions} onSearch={(ingredients) => {
              setIngredients(ingredients);
              sessionStorage.setItem("recipeIngredients", JSON.stringify(ingredientsRef.current));
              handleSearch(false);
            }} initialTags={typeof window !== "undefined" && sessionIngredients ? JSON.parse(sessionIngredients) : []} /> 
        </div>
      </div>
      <div className="flex w-full px-3 pb-3 gap-3">
        {/* Filters */}
        <div className="sticky top-0 self-start shrink-0 pt-3">
          <Filters onChange={(selectedFilters) => {
            setFilters(selectedFilters);
            sessionStorage.setItem("recipeFilters", JSON.stringify(filtersRef.current));
            handleSearch(false);
          }} />
        </div>
        
        {/* Recipes */}
        <div id="recipes" className="flex-1 min-w-0 pt-3">
          <RecipeGrid recipes={recipes} loading={loading} />
        </div>
      </div>
    </section>
  );
}