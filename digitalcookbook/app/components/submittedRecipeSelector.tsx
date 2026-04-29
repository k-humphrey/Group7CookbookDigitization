"use client";

import { useEffect, useState } from "react";
import InfoCard from "@/app/components/infocard";

export default function SubmittedRecipeSelector() {
    const [recipes, setRecipes] = useState<any[]>([]);
    const [modalRecipe, setModalRecipe] = useState<any | null>(null);
    const [ingredientsList, setIngredientsList] = useState<any[]>([]);
    const [tagsList, setTagsList] = useState<any[]>([]);
    const [unitsList, setUnitsList] = useState<any[]>([]);

    const fetchAll = async () => {
        const [r, i, t, u] = await Promise.all([
            fetch("/api/submitted-recipes").then(res => res.json()),
            fetch("/api/ingredients").then(res => res.json()),
            fetch("/api/tags/all").then(res => res.json()),
            fetch("/api/units").then(res => res.json())
        ]);
        setRecipes(r);
        setIngredientsList(i);
        setTagsList(t);
        setUnitsList(u.uniqueUnits);
    };

    useEffect(() => { fetchAll(); }, []);

    const handleSave = async () => {
       
        // Calculate costs exactly like AdminPanelClient
        const formattedIngredients = modalRecipe.ingredients.map((ing: any) => {
            const cost = (Number(ing.amount) * (ing.multiplier || 1) * (ing.price || 0)) / (ing.packageSize || 1);
            return { ...ing, ingredientCost: cost };
        });

        const totalCost = formattedIngredients.reduce((sum: number, i: any) => sum + (i.ingredientCost || 0), 0);

        const updated = {
            ...modalRecipe,
            ingredients: formattedIngredients,
            totalCost,
            tags: Object.fromEntries(tagsList.map(tag => [tag.en, !!modalRecipe.tags?.[tag.en]])),
            espTags: Object.fromEntries(tagsList.map(tag => [tag.es, !!modalRecipe.espTags?.[tag.es]])),
        };

        if(modalRecipe.status == "rejected"){
            console.log("Deleting recipe with id\n")
            console.log(updated._id)
            await fetch("/api/edit-recipes/", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({_id: updated._id}), 
            });
            setModalRecipe(null);
            fetchAll();
        }
        else if(modalRecipe.status == "approved"){
            await fetch("/api/edit-recipes/", {
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body:JSON.stringify(updated),
            });
            setModalRecipe(null);
            fetchAll();
        }
        else{
            await fetch("/api/submitted-recipes", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated),
            });
            setModalRecipe(null);
            fetchAll();
        }
        
    };

    return (
        <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recipes.map(recipe => (
                    <InfoCard 
                        key={recipe._id} 
                        title={recipe.title.en} 
                        description={recipe.instructions.en}
                        href="#"
                        imageSrc={recipe.imageURI}
                        action={
                            <div className="flex gap-2">
                                <button className="btn btn-sm btn-primary" onClick={() => setModalRecipe(recipe)}>Review</button>
                            </div>
                        }
                    />
                ))}
            </div>

            {modalRecipe && (
                <dialog className="modal modal-open">
                    <div className="modal-box max-w-4xl">
                        <h3 className="font-bold text-lg mb-4">Edit Submitted Recipe</h3>
                        <div className="space-y-4">
                            {/* Mirror the exact table structure from your admin panel */}
                            <div className="overflow-x-auto">
                                <table className="table table-compact w-full">
                                    <thead>
                                        <tr><th>Ingredient</th><th>Amt</th><th>Unit</th><th>Cost</th></tr>
                                    </thead>
                                    <tbody>
                                        {modalRecipe.ingredients.map((ing: any, idx: number) => (
                                            <tr key={idx}>
                                                <td>{ing.en}</td>
                                                <td>{ing.amount}</td>
                                                <td>{ing.unit}</td>
                                                <td>${ing.ingredientCost?.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* Category and Status updates */}
                            <select className="select select-bordered w-full" value={modalRecipe.status} onChange={(e) => setModalRecipe({...modalRecipe, status: e.target.value})}>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <div className="modal-action">
                            <button className="btn" onClick={() => setModalRecipe(null)}>Cancel</button>
                            <button className="btn btn-success" onClick={handleSave}>Save & Update</button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
}