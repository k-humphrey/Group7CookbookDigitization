// Recipes Page

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useLang } from "../components/languageprovider";

import Filters from "../components/filters";
import RecipeGrid from "../components/recipecards";
import Searchbar from "../components/searchbar";

export default function RecipeSearchPage() {
  const [recipes, setRecipes] = useState<any[]>([]); // Store recipes in state
  const langContext = useLang();
  const lang = langContext?.lang ?? 'en';

  // get initial ingredients from url
  const initialParam = useSearchParams().get("ingredients");
  const initialTags = initialParam ? initialParam.split(",") : [];

  // reference arrays for search
  const ingredientsRef = useRef<string[]>(initialTags);
  const filtersRef =  useRef({appliances: [] as string[], tags: { healthTags: [] as string[], allergenTags: [] as string[]}, maxCost: 10});

  // reference array for page info
  const pageInfoRef = useRef({page: 1, isLocked: false, limit: 15});

  // Initial loading for page and after language change
  useEffect(() => {
    handleSearch(ingredientsRef.current, filtersRef.current.appliances, filtersRef.current.tags, false, filtersRef.current.maxCost);

  }, [lang]);

  // Get search params and return appropriate url
  const buildURL = (ingredients: string[], appliances: string[], tags: { healthTags: string[], allergenTags: string[] }, maxCost: number) => {
    const filters = new URLSearchParams();

    // add filters to url search param if available
    if(ingredients.length > 0)
      filters.set("ingredients", ingredients.join(","));
    if(appliances.length > 0)
      filters.set("appliances", appliances.join(","));
    if(tags.healthTags.length > 0)
      filters.set("healthTags", tags.healthTags.join(","));
    if(tags.allergenTags.length > 0)
      filters.set("allergenTags", tags.allergenTags.join(","))
    if (maxCost !== undefined)
      filters.set("maxCost", String(maxCost));

    // if no filters return all on current page
    if(filters.size === 0)
      return `/api/recipes?page=${pageInfoRef.current.page}&limit=${pageInfoRef.current.limit}`

    // set page params
    filters.set("limit", `${pageInfoRef.current.limit}`);
    filters.set("page", `${pageInfoRef.current.page}`);
    filters.set("lang", lang);

    // return url with filters applied
    return `/api/recipes/bySearch?${filters.toString()}`

  };
  
  // search for recipes in the database
  const handleSearch = useCallback(async (ingredients: string[], appliances: string[], tags: { healthTags: string[], allergenTags: string[] }, load: boolean, maxCost: number) => {
    // page loading, lock to prevent multiple loads
    pageInfoRef.current.isLocked = true;

    // load new recipes?
    if(load)
      pageInfoRef.current.page += 1;
    else { // else, its a new search, reset Recipes and Page Number
      pageInfoRef.current.page = 1;
      setRecipes([]);
    }

    // build search url and get newRecipes
    const url = buildURL(ingredients, appliances, tags, maxCost);
    const data = await (await fetch(url)).json();
    const newRecipes = Array.isArray(data) ? data : (data.recipes ?? data ?? []);

    // append newRecipes if load, else: new search, reset recipes to newRecipes
    setRecipes(prev => (load ? [...prev, ...newRecipes] : newRecipes));

    // finished loading page, lock loading if no newRecipes, till new search (!load)
    if(newRecipes.length > 0 || !load) {
      window.scrollBy({top: -50, behavior: 'smooth'}); // scroll up 50px
      pageInfoRef.current.isLocked = false;
    }
    
  }, []);

  // Scroll listener: check to see if user scrolls to bottom of page
  useEffect(() => {
    const checkScroll = () => {
      window.requestAnimationFrame(() => {
        const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 500; // 500px from bottom
        
        // if nearBottom and not loading then load new recipes
        if(nearBottom && !pageInfoRef.current.isLocked)
          handleSearch(ingredientsRef.current, filtersRef.current.appliances, filtersRef.current.tags, true, filtersRef.current.maxCost);
        })
    };

    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => window.removeEventListener("scroll", checkScroll);

  }, []);

  return (
    <div>
      {/* Background Image */}
      <div 
        className="w-full bg-cover bg-center bg-no-repeat pt-15 pb-5 flex flex-col items-center"  
        style={{
        backgroundSize: "110%", 
        backgroundImage: "url('/searchbackground.jpg')"
        }}
      >
       <Searchbar onSearch={(ingredients) => {
          ingredientsRef.current = ingredients;
          handleSearch(ingredientsRef.current, filtersRef.current.appliances, filtersRef.current.tags, false, filtersRef.current.maxCost);
        }} initialTags={initialTags} /> 
      </div>
      
      <div className="flex w-full gap-6">

        {/* Filters */}
        <div className="w-52 sticky top-0 self-start shrink-0">
          <Filters onChange={(selectedFilters) => {
            filtersRef.current = selectedFilters;
            handleSearch(ingredientsRef.current, filtersRef.current.appliances, filtersRef.current.tags, false, filtersRef.current.maxCost);
          }} />
        </div>
        
        {/* Recipes */}
        <div className="flex-1">
          <RecipeGrid recipes={recipes} />
        </div>
      </div>
    </div>
  );
}