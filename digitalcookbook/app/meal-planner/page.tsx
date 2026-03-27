"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import RecipePicker from "@/app/meal-planner/recipePicker";
import PlanSummary from "@/app/meal-planner/planSummary";
import { useLang } from "@/app/components/languageprovider";
import { PLANNER_STRINGS } from "@/app/meal-planner/plannerStrings";
import { SelectedRecipe } from "@/lib/combineIngredients";
import { IngredientPriceInfo } from "@/app/api/ingredients/byIDsGetIngredientPriceInfo/route";

export default function BackpackPlannerPage() {
    // State for selected recipes and their servings
    const [selectedRecipes, setSelectedRecipes] = useState<SelectedRecipe[]>(() => {
        const sessionPlannerRecipes = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("plannerRecipes") || "[]") : [];
        return sessionPlannerRecipes;
    });

    // State for ingredientPriceInfo
    const [ingredientPriceInfo, setIngredientPriceInfo] = useState<Record<string, IngredientPriceInfo>>({});

    // Lang settings
    const langContext = useLang();
    const lang = langContext?.lang ?? 'en';
    const t = PLANNER_STRINGS[lang];

    // Save selected recipes to session storage and get ingredient prices
    useEffect(() => {
        sessionStorage.setItem("plannerRecipes", JSON.stringify(selectedRecipes));

        // get ingredient prices
        fetch(`/api/ingredients/byIDsGetIngredientPriceInfo?ids=${Array.from(new Set(selectedRecipes.flatMap(recipes => recipes.recipe.ingredients.map(ingredient => ingredient.ingredient)))).filter(Boolean).join(",")}`)
        .then(res => res.json())
        .then((data: Record<string, IngredientPriceInfo>) => setIngredientPriceInfo(data));

    }, [selectedRecipes]);

    return (
        <section aria-label={t.pageTitle} className="relative bg-base-100">

            {/* Background picture */}
            <div className="fixed inset-0 top-0 bottom-[75px]">
                <Image
                    src="/searchbackground2.0.webp"
                    alt=""
                    fill
                    priority
                    className="object-cover scale-105"
                />
            </div>

            <div className="relative w-full pt-14 pb-5 flex flex-col items-center">

                <div className="relative mx-auto w-full px-3">

                    {/* PAGE HEADER */}
                    <div className="flex flex-col items-center gap-5 text-center">
                        <h1 className="text-3xl md:text-7xl font-bold">{t.pageTitle}</h1>
                        <p className="text-lg bg-base-100/85 p-2 inline-block rounded-md">
                            {t.pageDescription}
                        </p>
                    </div>

                    {/* MAIN GRID */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* RECIPE PICKER */}
                        <section aria-label={t.recipePickerSection} className="order-2 lg:order-1 lg:col-span-1">
                            <RecipePicker selectedRecipes={selectedRecipes} setSelectedRecipes={setSelectedRecipes} />
                        </section>

                        {/* SUMMARY PANEL */}
                        <section aria-label={t.summaryPanelSection} className="order-1 lg:order-2 lg:col-span-1">
                            <PlanSummary selectedRecipes={selectedRecipes} setSelectedRecipes={setSelectedRecipes} ingredientPriceInfo={ingredientPriceInfo} />
                        </section>
                    </div>
                </div>
            </div>
        </section>
    );
}