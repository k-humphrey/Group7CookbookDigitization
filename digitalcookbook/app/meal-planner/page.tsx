"use client";

import { useState } from "react";

import RecipePicker from "@/app/meal-planner/recipePicker";
import PlanSummary from "@/app/meal-planner/planSummary";
import { useLang } from "@/app/components/languageprovider";
import { PLANNER_STRINGS } from "@/app/meal-planner/plannerStrings";

// Type for ingredient
export type Ingredient = {
    ingredient: string;
    amount: number;
    unit: string;
    en: string;
    es: string;
    costPerUnit: number;
    baseUnit: string;
    productLink: string;
    multiplier: number;
};

// Type for recipe
export type Recipe = {
    _id: string;
    title: {en: string; es: string};
    totalCost: number;
    ingredients: Ingredient[];
    ingredientPlainText: {en: string; es: string};
    imageURI: string;
};

// Type for selected recipe with servings
export type SelectedRecipe = {
    recipe: Recipe;
    servings: number;
}

export default function BackpackPlannerPage() {
    // State for selected recipes and their servings
    const [selectedRecipes, setSelectedRecipes] = useState<SelectedRecipe[]>([])

    // Lang settings
    const langContext = useLang();
    const lang = langContext?.lang ?? 'en';
    const t = PLANNER_STRINGS[lang];

    return (
        <main className="min-h-screen bg-base-100">
            {/* Background Image */}
            <div 
                className="w-full bg-cover bg-center pt-14 pb-5 flex flex-col items-center"  
                style={{ backgroundSize: "110%", backgroundImage: "url('/searchbackground2.0.png')" }}
            >
                    
                <div className="mx-auto w-full px-3">

                    {/* PAGE HEADER */}
                    <div className="flex flex-col gap-5 text-center">
                        <h1 className="text-3xl md:text-7xl font-bold">{t.pageTitle}</h1>
                        <p className="text-lg">
                            {t.pageDescription}
                        </p>
                    </div>

                    {/* MAIN GRID */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* RECIPE PICKER */}
                        <div className="order-2 lg:order-1 lg:col-span-1">
                            <RecipePicker selectedRecipes={selectedRecipes} setSelectedRecipes={setSelectedRecipes} />
                        </div>

                        {/* SUMMARY PANEL */}
                        <div className="order-1 lg:order-2 lg:col-span-1">
                            <PlanSummary selectedRecipes={selectedRecipes} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}