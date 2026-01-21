"use client";

import { useState, useEffect } from "react";

import Filters from "../components/filters";
import RecipeGrid from "../components/recipecards";
import Searchbar from "../components/searchbar"

export default function RecipeSearchPage() {
  const [recipes, setRecipes] = useState<any[]>([]); // Store recipes in state

  // Populate all recipes on launch
  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
        const res = await fetch("/api/recipes");
        const data = await res.json();
        setRecipes(data);
      } catch (err) {
        console.error("Failed to fetch recipes:", err);
      }
    };

    fetchAllRecipes();
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
       <Searchbar onSearch={handleSearch} /> 
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