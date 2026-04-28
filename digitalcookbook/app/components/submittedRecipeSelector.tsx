// app/components/submittedRecipeSelector.tsx
"use client";

import { useEffect, useState } from "react";
import InfoCard from "@/app/components/infocard";
import { uploadImage } from "@/lib/uploadImage";

export default function SubmittedRecipeSelector() {
    const [recipes, setRecipes] = useState<any[]>([]);
    const [modalRecipe, setModalRecipe] = useState<any | null>(null);
    const [ingredientsList, setIngredientsList] = useState<any[]>([]);
    const [unitsList, setUnitsList] = useState<any[]>([]);
    
    // Standard data fetching mirrored from adminPanelClient
    const fetchAllData = async () => {
        const [subRes, ingRes, unitRes] = await Promise.all([
            fetch("/api/submitted-recipes"),
            fetch("/api/ingredients"),
            fetch("/api/units")
        ]);
        setRecipes(await subRes.json());
        setIngredientsList(await ingRes.json());
        setUnitsList((await unitRes.json()).uniqueUnits);
    };

    useEffect(() => { fetchAllData(); }, []);

    const handleApprove = async (recipe: any) => {
        const res = await fetch("/api/submitted-recipes/approve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ _id: recipe._id }),
        });
        if (res.ok) fetchAllData();
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Submitted Recipes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map(recipe => (
                    <InfoCard 
                        key={recipe._id} 
                        title={recipe.title.en} 
                        imageSrc={recipe.imageURI}
                        action={
                            <div className="flex gap-2">
                                <button className="btn btn-primary btn-sm" onClick={() => setModalRecipe(recipe)}>Edit</button>
                                <button className="btn btn-success btn-sm" onClick={() => handleApprove(recipe)}>Approve</button>
                            </div>
                        }
                    />
                ))}
            </div>

            {modalRecipe && (
                <dialog className="modal modal-open">
                    <div className="modal-box max-w-4xl">
                        <h3 className="text-lg font-bold mb-4">Review Submission</h3>
                        {/* Use the exact form fields from adminPanelClient here */}
                        <div className="flex flex-col gap-4">
                            <label className="font-bold">Title (EN)</label>
                            <input className="input input-bordered" value={modalRecipe.title.en} onChange={(e) => setModalRecipe({...modalRecipe, title: {...modalRecipe.title, en: e.target.value}})} />
                            
                            <label className="font-bold">Instructions (EN)</label>
                            <textarea className="textarea textarea-bordered h-32" value={modalRecipe.instructions.en} onChange={(e) => setModalRecipe({...modalRecipe, instructions: {...modalRecipe.instructions, en: e.target.value}})} />
                            
                            {/* Structured Ingredients Table (Matching Admin Panel) */}
                            <div className="mt-4">
                                <h4 className="font-bold mb-2">Ingredients</h4>
                                <div className="overflow-x-auto">
                                    <table className="table table-compact w-full">
                                        <thead>
                                            <tr><th>Name</th><th>Amount</th><th>Unit</th></tr>
                                        </thead>
                                        <tbody>
                                            {modalRecipe.ingredients?.map((ing: any, idx: number) => (
                                                <tr key={idx}>
                                                    <td>{ing.en}</td>
                                                    <td>{ing.amount}</td>
                                                    <td>{ing.unit}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="modal-action">
                            <button className="btn" onClick={() => setModalRecipe(null)}>Close</button>
                            <button className="btn btn-primary" onClick={async () => {
                                await fetch("/api/submitted-recipes", { method: "PUT", headers: {"Content-Type":"application/json"}, body: JSON.stringify(modalRecipe) });
                                setModalRecipe(null);
                                fetchAllData();
                            }}>Save Changes</button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
}