"use client";

import { useState, useEffect } from "react";
import InfoCard from "@/app/components/infocard";

const PAGE_SIZE = 6; // 2 rows x 3 columns

interface Props {
    recipes: any[];
    featuredIds: string[]
}

export default function FeaturedRecipeSelector({ recipes, featuredIds }: Props) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [page, setPage] = useState(0);

    // calculate pagination information
    const totalPages = Math.ceil(recipes.length / PAGE_SIZE);
    const pageRecipes = recipes.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

    // set already selected featured recipes
    useEffect(() => {
        setSelectedIds(featuredIds || []);

    }, [featuredIds])

    // function to update featured recipes shown
    async function updateFeaturedRecipes(ids: string[]) {
        try {
            await fetch("/api/recipes/featured", {
                method: "POST",
                body: JSON.stringify({ recipeIds: ids }),
                headers: { "Content-Type": "application/json" }
            });
        } catch (err) {
            console.error("Failed to update Featured Recipes");
        }
    };

    // toggle recipes selected
    function toggle(id: string) {
        if(selectedIds.includes(id)) { // unselect
            const newSelected = selectedIds.filter(i => i !== id);

            // update selected and featured recipes
            setSelectedIds(newSelected);
            updateFeaturedRecipes(newSelected);

        } else if(selectedIds.length < 3) { // select
            const newSelected = [...selectedIds, id];

            // update selected and featured recipes
            setSelectedIds(newSelected);
            updateFeaturedRecipes(newSelected);

        }
    };

    return (
        <div className="flex flex-col items-center w-full">
            {/* Selection Info */}
            <div className="justify-between w-full flex max-w-6xl mb-4 px-6">
                <h2 className="text-xl font-semibold">
                    Featured Recipes
                </h2>

                <div>
                    {selectedIds.length} / 3 selected
                </div>
            </div>

            {/* Recipe Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl p-6">
                {pageRecipes.map(recipe => (
                    <InfoCard
                        key={recipe._id}
                        title={recipe.title.en}
                        description=""
                        href="#"
                        imageSrc={recipe.imageURI.trimEnd()}
                        action={
                            <button className={`btn btn-sm ${selectedIds.includes(recipe._id) ? "btn-error" : "btn-primary"}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggle(recipe._id);
                                }}
                            >
                                {selectedIds.includes(recipe._id) ? "Remove" : "Add"}
                            </button>
                        }
                    />
                ))}
            </div>

            {/* Pagination Buttons */}
            <div className="flex justify-between w-full max-w-6xl mt-6 px-6">
                <button className="btn btn-outline"
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}    
                >
                    Previous
                </button>

                <div>
                    <span>Page </span>
                    <input className="border rounded px-2 py-1 w-14 text-center"
                        type="number"
                        min={1}
                        max={totalPages}
                        value={page + 1}
                        onChange={(e) => {
                            let val = parseInt(e.target.value, 10);
                            if(!isNaN(val)) {
                                if (val < 1)
                                    val = 1;
                                else if (val > totalPages)
                                    val = totalPages;
                                setPage(val - 1);
                            }
                        }}
                    />
                    <span> of {totalPages}</span>
                </div>

                <button className="btn btn-outline"
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>
            </div>

        </div>
    );
}