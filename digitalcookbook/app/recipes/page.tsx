"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import Filters from "../components/filters";
import RecipeGrid from "../components/recipecards";
import Searchbar from "../components/searchbar"

export default function RecipeSearchPage() {
  const [recipes, setRecipes] = useState<any[]>([]); // Store recipes in state
  const tagParam = useSearchParams().get("ingredients");
  const initialTags = tagParam ? tagParam.split(",") : [];

  // Initial loading for page
  useEffect(() => {
    handleSearch(initialTags);
  }, []);

  const handleSearch = async (tags: string[]) => {
    try {
      let url = "/api/recipes";

      if (tags.length > 0)
        url = `/api/recipes/bySearch?ingredients=${tags.join(",")}`;

      const res = await fetch(url);
      const data = await res.json();
      setRecipes(data);
    } catch (err) {
        console.error("Failed to fetch recipes:", err);
    }
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
       <Searchbar onSearch={handleSearch} initialTags={initialTags} /> 
      </div>
      
      <div className="flex w-full gap-6">

        {/* Filters */}
        <div className="w-64 sticky top-0 self-start shrink-0">
          <Filters />
        </div>
        
        {/* Recipes */}
        <div className="flex-1">
          <RecipeGrid recipes={recipes} />
        </div>
      </div>
    </div>
  );
}