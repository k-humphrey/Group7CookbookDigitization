"use client";

import { useState, useRef } from "react";

// Types for different tags
type Tags = {
    healthTags: string[];
    allergenTags: string[];
}

// Type for filters
type Filters = {
    appliances: string[];
    tags: Tags;
    maxCost: number;
}

// Custom hook to handle recipe search and pagination logic, to be used in RecipeSearchPage component, to keep the component clean and separate logic from UI 
export function useRecipeSearch(lang: string) {
    const [recipes, setRecipes] = useState<any[]>([]); // Store recipes in state

    // reference arrays for search
    const ingredientsRef = useRef<string[]>([]);
    const filtersRef =  useRef<Filters>({appliances: [] as string[], tags: { healthTags: [] as string[], allergenTags: [] as string[]}, maxCost: Infinity});

    // reference array for page info
    const pageInfoRef = useRef({page: 1, isLocked: false, limit: 15});

    // build url for recipe search based on search parameters
    const buildURL = (ingredients: string[], filters: Filters) => {
        const params = new URLSearchParams();

        // add filters to url search param if available
        if(ingredients.length > 0)
            params.set("ingredients", ingredients.join(","));
        if(filters.appliances.length > 0)
            params.set("appliances", filters.appliances.join(","));
        if(filters.tags.healthTags.length > 0)
            params.set("healthTags", filters.tags.healthTags.join(","));
        if(filters.tags.allergenTags.length > 0)
            params.set("allergenTags", filters.tags.allergenTags.join(","))
        if (filters.maxCost !== null && filters.maxCost !== Infinity)
            params.set("maxCost", String(filters.maxCost));

        // if no filters return all on current page
        if(params.size === 0)
            return `/api/recipes?page=${pageInfoRef.current.page}&limit=${pageInfoRef.current.limit}`

        // set page params
        params.set("limit", `${pageInfoRef.current.limit}`);
        params.set("page", `${pageInfoRef.current.page}`);
        params.set("lang", lang);

        // return url with filters applied
        return `/api/recipes/bySearch?${params.toString()}`

    };
    
    // search for recipes in the database
    const handleSearch = async (load: boolean) => {
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
        const url = buildURL(ingredientsRef.current, filtersRef.current);
        try {

            // Fetch data
            const response =  await fetch(url);
            const data = await response.json();

            // Get new recipes from data
            const newRecipes = Array.isArray(data) ? data : Array.isArray(data?.recipes) ? data.recipes : [];

            // append newRecipes if load, else: new search, reset recipes to newRecipes
            setRecipes(prev => (load ? [...prev, ...newRecipes] : newRecipes));

            // finished loading page, lock loading if no newRecipes, till new search (!load)
            if(newRecipes.length > 0 || !load) {
                window.scrollBy({top: -50, behavior: 'smooth'}); // scroll up 50px
                pageInfoRef.current.isLocked = false;
            }

        } catch(e) {
            console.warn("Failed to fetch recipes: ", e);
            pageInfoRef.current.isLocked = false;
        }
    };

    // setters for ingredients and filters, to be used in searchbar and filters components, so they can update the current search parameters without needing to pass them in the function call
    const setIngredients = (ingredients: string[]) => {
        ingredientsRef.current = ingredients;
    };

    const setFilters = (filters: Filters) => {
        filtersRef.current = filters;
    };

    // return recipes and handleSearch function to be used in the RecipeSearchPage component, along with setters for ingredients and filters, and pageInfoRef for Pagination
    return {recipes, handleSearch, setIngredients, setFilters, pageInfoRef, filtersRef, ingredientsRef};
}