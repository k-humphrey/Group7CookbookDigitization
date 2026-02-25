// Recipes Page

"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useLang } from "../components/languageprovider";
import { useRecipeSearch } from "@/hooks/useRecipeSearch";

// Components
import Filters from "@/app/components/filters";
import RecipeGrid from "@/app/components/recipecards";
import Searchbar from "@/app/components/searchbar";

export default function RecipeSearchPage() {
  const langContext = useLang();
  const lang = langContext?.lang ?? 'en';

  // get initial ingredients from url
  const initialParam = useSearchParams().get("ingredients");
  const initialTags = initialParam ? initialParam.split(",") : [];

  // custom hook for recipe search and pagination logic
  const { recipes, handleSearch, setIngredients, setFilters, pageInfoRef } = useRecipeSearch(lang);

  // Initial loading for page and after language change
  useEffect(() => {
    if(initialTags.length > 0)
      setIngredients(initialTags);

    handleSearch(false);
  }, [lang]);

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

  return (
    <div>

      <a href="#recipes" className="sr-only">Skip to recipes</a>

      {/* Background Image */}
      <div 
        className="w-full bg-cover bg-center bg-no-repeat py-6 flex flex-col items-center"  
        style={{
        backgroundSize: "110%", 
        backgroundImage: "url('/searchbackground.jpg')"
        }}
      >
        <div className="w-11/12 md:w-full">
        <Searchbar onSearch={(ingredients) => {
            setIngredients(ingredients);
            handleSearch(false);
          }} initialTags={initialTags} /> 
        </div>
      </div>
      <div className="flex w-full">
        {/* Filters */}
        <div className="sticky top-0 self-start shrink-0">
          <Filters onChange={(selectedFilters) => {
            setFilters(selectedFilters);
            handleSearch(false);
          }} />
        </div>
        
        {/* Recipes */}
        <div id="recipes" className="flex-1">
          <RecipeGrid recipes={recipes} />
        </div>
      </div>
    </div>
  );
}