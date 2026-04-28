"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/app/components/languageprovider";
import { uploadImage } from "@/lib/uploadImage";

const STRINGS = {
    en: {
        title: "Submit Recipe",
        recipeTitle: "Title",
        ingredients: "Ingredients",
        instructions: "Instructions",
        image: "Recipe Image",
        tags: "Tags",
        allergens: "Allergens",
        appliances: "Appliances",
        category: "Category",
        cancel: "Cancel",
        submit: "Submit",
        success: "Recipe submitted successfully.",
    },
    es: {
        title: "Enviar Receta",
        recipeTitle: "Título",
        ingredients: "Ingredientes",
        instructions: "Instrucciones",
        image: "Imagen de la receta",
        tags: "Etiquetas",
        allergens: "Alérgenos",
        appliances: "Electrodomésticos",
        category: "Categoría",
        cancel: "Cancelar",
        submit: "Enviar",
        success: "Receta enviada con éxito.",
    },
} as const;

function getMultiplier(units: any[], from: string, to: string) {
    if (from === to || from === "each") return 1;
    const direct = units.find(unit => unit.fromUnit === from && unit.toUnit === to);
    if (direct) return direct.multiplier;
    const reverse = units.find(unit => unit.fromUnit === to && unit.toUnit === from);
    if (reverse) return 1 / reverse.multiplier;
    return 1;
}

export default function SubmittedRecipeModal({ open, onClose }: { open: boolean; onClose: () => void; }) {
    const langContext = useLang();
    const lang = langContext?.lang ?? "en";
    const t = STRINGS[lang as keyof typeof STRINGS];

    const [recipe, setRecipe] = useState<any>({
        title: { en: "", es: "" },
        ingredientPlainText: { en: "", es: "" },
        instructions: { en: "", es: "" },
        imageURI: "",
        public_id: "",
        tags: {},
        espTags: {},
        ingredients: [],
        appliances: [],
        allergens: {},
        espAllergens: {},
        category: "lunchDinner"
    });

    const [tagsList, setTagsList] = useState<any[]>([]);
    const [allergensList, setAllergensList] = useState<any[]>([]);
    const [appliancesList, setAppliancesList] = useState<any[]>([]);
    const [ingredientsList, setIngredientsList] = useState<any[]>([]);
    const [unitsList, setUnitsList] = useState<any[]>([]);
    const [ingredientSearch, setIngredientSearch] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!open) return;
        const fetchData = async () => {
            const [tags, allergens, appliances, ingredients, units] = await Promise.all([
                fetch("/api/tags/all").then(res => res.json()),
                fetch("/api/allergens/all").then(res => res.json()),
                fetch("/api/appliances/all").then(res => res.json()),
                fetch("/api/ingredients").then(res => res.json()),
                fetch("/api/units").then(res => res.json())
            ]);
            setTagsList(tags);
            setAllergensList(allergens);
            setAppliancesList(appliances);
            setIngredientsList(ingredients);
            setUnitsList(units.uniqueUnits);
        };
        fetchData();
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Mirror the exact Admin Panel formatting logic
        const formattedIngredients = recipe.ingredients.map((ing: any) => {
            const ingredientCost = (Number(ing.amount) * (ing.multiplier || 1) * (ing.price || 0)) / (ing.packageSize || 1);
            return {
                ...ing,
                ingredientCost: ingredientCost
            };
        });

        const totalCost = formattedIngredients.reduce((sum: number, ing: any) => sum + (ing.ingredientCost || 0), 0);

        const payload = {
            ...recipe,
            ingredients: formattedIngredients,
            totalCost,
            tags: Object.fromEntries(tagsList.map(tag => [tag.en, !!recipe.tags?.[tag.en]])),
            espTags: Object.fromEntries(tagsList.map(tag => [tag.es, !!recipe.espTags?.[tag.es]])),
            allergens: Object.fromEntries(allergensList.map(a => [a.en, !!recipe.allergens?.[a.en]])),
            espAllergens: Object.fromEntries(allergensList.map(a => [a.es, !!recipe.espAllergens?.[a.es]])),
        };

        try {
            const res = await fetch("/api/submitted-recipes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                alert(t.success);
                onClose();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!open) return null;

    return (
        <dialog className="modal modal-open">
            <div className="modal-box max-w-4xl max-h-[90vh] overflow-y-auto">
                <h3 className="font-bold text-2xl mb-6">{t.title}</h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Category Selection */}
                    <div className="form-control">
                        <label className="label font-bold">{t.category}</label>
                        <select 
                            className="select select-bordered" 
                            value={recipe.category}
                            onChange={(e) => setRecipe({...recipe, category: e.target.value})}
                        >
                            <option value="breakfast">Breakfast</option>
                            <option value="lunchDinner">Lunch/Dinner</option>
                            <option value="dessert">Dessert</option>
                            <option value="snack">Snack</option>
                        </select>
                    </div>

                    {/* Title and Instructions mirrored from Admin Panel UI */}
                    <div className="grid grid-cols-2 gap-4">
                        <input className="input input-bordered" placeholder="Title (EN)" value={recipe.title.en} onChange={(e) => setRecipe({...recipe, title: {...recipe.title, en: e.target.value}})} />
                        <input className="input input-bordered" placeholder="Title (ES)" value={recipe.title.es} onChange={(e) => setRecipe({...recipe, title: {...recipe.title, es: e.target.value}})} />
                    </div>

                    {/* Ingredient Selection Logic */}
                    <div>
                        <label className="label font-bold">{t.ingredients}</label>
                        <input type="text" placeholder="Search ingredients..." className="input input-bordered w-full mb-2" onChange={(e) => setIngredientSearch(e.target.value)} />
                        <div className="border rounded-md p-4 max-h-64 overflow-y-auto space-y-2">
                            {ingredientsList.filter(i => i.en.toLowerCase().includes(ingredientSearch.toLowerCase())).map(ing => (
                                <div key={ing._id} className="flex flex-col gap-2 p-2 border-b last:border-0">
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" className="checkbox" checked={recipe.ingredients.some((i: any) => i._id === ing._id)} 
                                            onChange={(e) => {
                                                if (e.target.checked) setRecipe({...recipe, ingredients: [...recipe.ingredients, {...ing, amount: "", unit: ing.packageSizeUnit, multiplier: 1}]});
                                                else setRecipe({...recipe, ingredients: recipe.ingredients.filter((i: any) => i._id !== ing._id)});
                                            }} 
                                        />
                                        <span>{ing.en} / {ing.es}</span>
                                    </label>
                                    {recipe.ingredients.find((i: any) => i._id === ing._id) && (
                                        <div className="flex gap-2 pl-8">
                                            <input type="number" placeholder="Amt" className="input input-bordered input-sm w-24" onChange={(e) => {
                                                setRecipe({...recipe, ingredients: recipe.ingredients.map((i: any) => i._id === ing._id ? {...i, amount: e.target.value} : i)});
                                            }} />
                                            <select className="select select-bordered select-sm" onChange={(e) => {
                                                const mult = getMultiplier(unitsList, e.target.value, ing.packageSizeUnit);
                                                setRecipe({...recipe, ingredients: recipe.ingredients.map((i: any) => i._id === ing._id ? {...i, unit: e.target.value, multiplier: mult} : i)});
                                            }}>
                                                {unitsList.map(u => <option key={u.fromUnit} value={u.fromUnit}>{u.fromUnit}</option>)}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="modal-action">
                        <button type="button" className="btn" onClick={onClose}>{t.cancel}</button>
                        <button type="submit" className="btn btn-success" disabled={isSubmitting}>{t.submit}</button>
                    </div>
                </form>
            </div>
        </dialog>
    );
}