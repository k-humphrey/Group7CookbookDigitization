// Recipes Page

"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

import Filters from "../components/filters";
import RecipeGrid from "../components/recipecards";
import Searchbar from "../components/searchbar";

export default function RecipeSearchPage() {
  const [recipes, setRecipes] = useState<any[]>([]); // Store recipes in state
  const searchParams = useSearchParams();

  const initialParam = searchParams.get("ingredients"); // get initial ingredients from url
  const initialTags = initialParam ? initialParam.split(",") : [];

  // reference arrays for search
  const ingredientsRef = useRef<string[]>(initialTags);
  const filtersRef =  useRef({ appliances: [] as string[], tags: { healthTags: [] as string[], allergenTags: [] as string[]}});

  // Initial loading for page
  useEffect(() => {
    handleSearch(ingredientsRef.current, filtersRef.current.appliances, filtersRef.current.tags);
  }, []);
  
  // search for recipes in the database
  const handleSearch = async (ingredients: string[], appliances: string[], tags: { healthTags: string[], allergenTags: string[] }) => {
    const filters = new URLSearchParams();

    // default url to return all recipes if no filters
    let url = "/api/recipes";

    // add filters to url search param if available
    if(ingredients.length > 0)
      filters.set("ingredients", ingredients.join(","));
    if(appliances.length > 0)
      filters.set("appliances", appliances.join(","));
    if(tags.healthTags.length > 0)
      filters.set("healthTags", tags.healthTags.join(","));
    if(tags.allergenTags.length > 0)
      filters.set("allergenTags", tags.allergenTags.join(","))

    // construct url if there are any tags
    if(filters.size > 0)
      url = `/api/recipes/bySearch?${filters.toString()}`;

    const res = await fetch(url);
    const data = await res.json();
    setRecipes(data.recipes ?? data ?? []);
  }

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
          handleSearch(ingredientsRef.current, filtersRef.current.appliances, filtersRef.current.tags);
        }} initialTags={initialTags} /> 
      </div>
      
      <div className="flex w-full gap-6">

        {/* Filters */}
        <div className="w-64 sticky top-0 self-start shrink-0">
          <Filters recipes={recipes} onChange={(appliances) => {
            filtersRef.current = appliances;
            handleSearch(ingredientsRef.current, filtersRef.current.appliances, filtersRef.current.tags);
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