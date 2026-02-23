"use client";

import { Recipe, SelectedRecipe } from "@/app/meal-planner/page";
import { useEffect } from "react";
import { useRecipeSearch } from "@/hooks/useRecipeSearch";
import { useLang } from "@/app/components/languageprovider";
import { PLANNER_STRINGS } from "@/app/meal-planner/plannerStrings";

// Import Components
import Filters from "@/app/components/filters";
import Searchbar from "@/app/components/searchbar";
import PlannerRecipeCards from "@/app/components/plannerRecipeCards";

// Props needed to pass selected recipes
interface Props {
    selectedRecipes: SelectedRecipe[];
    setSelectedRecipes: (recipes: SelectedRecipe[]) => void;
}

export default function RecipePicker({ selectedRecipes, setSelectedRecipes }: Props) {
    // Lang settings
    const langContext = useLang();
    const lang = langContext?.lang ?? 'en';
    const t = PLANNER_STRINGS[lang];

    // Hook to get recipes, search function, and page info ref for pagination
    const { recipes, handleSearch, setIngredients, setFilters, pageInfoRef } = useRecipeSearch(lang);

    // Initial loading for page and after language change
    useEffect(() => {
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

    // Toggle recipe selection in parent state
    function toggleRecipe(recipe: Recipe) {
        const isSelected = selectedRecipes.find(r => r.recipe._id === recipe._id);

        if (isSelected)
            setSelectedRecipes(selectedRecipes.filter(r => r.recipe._id !== recipe._id));
        else
            setSelectedRecipes([...selectedRecipes, { recipe, servings: 4 }]);

    }

    // Update servings for a selected recipe
    function updateServings(recipeID: string, servings: number) {
        if(servings < 1) 
            return;

        setSelectedRecipes(selectedRecipes.map(r => r.recipe._id === recipeID ? { ...r, servings } : r));
    }

    // Render recipe cards with add/remove button and servings input if selected
    return (
        <div>
            {/* Searchbar */}
            <div className="w-full pt-15 pb-5 flex flex-col items-center">
                <Searchbar onSearch={(ingredients) => {
                    setIngredients(ingredients);
                    handleSearch(false);
                }} /> 
            </div>

            <div className="flex w-full gap-6">

                {/* Filters */}
                <div className="w-64 sticky top-0 self-start shrink-0">
                    <Filters onChange={(selectedFilters) => {
                        setFilters(selectedFilters);
                        handleSearch(false);
                    }} />
                </div>

                {/* Recipe Grid */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recipes.map((recipe: Recipe) => {
                        const selected = selectedRecipes.find(r => r.recipe._id === recipe._id);

                        return (
                            <PlannerRecipeCards
                                key={recipe._id}
                                recipe={recipe}
                                selected={selected}
                                toggleRecipe={toggleRecipe}
                                updateServings={updateServings}
                            />
                            
                        );
                    })}
                </div>
            </div>
        </div>
    );
}