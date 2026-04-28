// app/components/submittedRecipeModal.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/app/components/languageprovider";
import Image from "next/image";
import { uploadImage } from "@/lib/uploadImage";

const STRINGS = {
    en: {
        title: "Submit Recipe",
        recipeTitle: "Title",
        ingredients: "Ingredients (Structured)",
        ingredientPlainText: "Ingredients (Plain Text)",
        instructions: "Instructions",
        image: "Recipe Image",
        tags: "Tags",
        allergens: "Allergens",
        appliances: "Appliances",
        addOtherLanguage: "Add Spanish",
        hideOtherLanguage: "Hide Spanish",
        english: "English",
        spanish: "Spanish",
        cancel: "Cancel",
        submit: "Submit",
        submitting: "Submitting...",
        uploadingImage: "Uploading image...",
        success: "Recipe submitted successfully.",
    },
    es: {
        title: "Enviar Receta",
        recipeTitle: "Título",
        ingredients: "Ingredientes (Estructurados)",
        ingredientPlainText: "Ingredientes (Texto Plano)",
        instructions: "Instrucciones",
        image: "Imagen de la receta",
        tags: "Etiquetas",
        allergens: "Alérgenos",
        appliances: "Electrodomésticos",
        addOtherLanguage: "Agregar inglés",
        hideOtherLanguage: "Ocultar inglés",
        english: "Inglés",
        spanish: "Español",
        cancel: "Cancelar",
        submit: "Enviar",
        submitting: "Enviando...",
        uploadingImage: "Subiendo imagen...",
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
    const [showOtherLanguage, setShowOtherLanguage] = useState(false);

    useEffect(() => {
        if (!open) return;
        fetch("/api/appliances/all").then(res => res.json()).then(data => setAppliancesList(data));
        fetch("/api/tags/all").then(res => res.json()).then(data => setTagsList(data));
        fetch("/api/allergens/all").then(res => res.json()).then(data => setAllergensList(data));
        fetch("/api/ingredients").then(res => res.json()).then(data => setIngredientsList(data));
        fetch("/api/units").then(res => res.json()).then(data => setUnitsList(data.uniqueUnits));
    }, [open]);

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/submitted-recipes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...recipe, submittedFromLang: lang }),
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

    return (
        <dialog className="modal modal-open">
            <div className="modal-box max-w-3xl max-h-[90vh] overflow-y-auto">
                <h3 className="font-bold text-2xl mb-6">{t.title}</h3>

                {/* Image Upload Logic from Admin Panel */}
                <label className="font-semibold block mb-2">{t.image}</label>
                <input className="file-input file-input-bordered w-full mb-4" type="file" accept="image/*"
                    onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            const res = await uploadImage(file);
                            if (res?.url) setRecipe({ ...recipe, imageURI: res.url, public_id: res.public_id });
                        }
                    }}
                />

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="flex flex-col">
                            <label className="font-semibold">{t.recipeTitle} (EN)</label>
                            <input className="input input-bordered" value={recipe.title.en} onChange={(e) => setRecipe({...recipe, title: {...recipe.title, en: e.target.value}})} />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold">{t.recipeTitle} (ES)</label>
                            <input className="input input-bordered" value={recipe.title.es} onChange={(e) => setRecipe({...recipe, title: {...recipe.title, es: e.target.value}})} />
                        </div>
                    </div>

                    {/* Structured Ingredient Logic */}
                    <h4 className="font-bold mt-6 mb-2">{t.ingredients}</h4>
                    <input type="text" placeholder="Search..." className="input input-bordered w-full mb-4" value={ingredientSearch} onChange={(e) => setIngredientSearch(e.target.value)} />
                    <div className="max-h-60 overflow-y-auto border p-4 rounded-lg mb-6">
                        {ingredientsList.filter(i => i.en.toLowerCase().includes(ingredientSearch.toLowerCase())).map(ing => {
                            const isChecked = recipe.ingredients.some((a: any) => a._id === ing._id);
                            return (
                                <div key={ing._id} className="flex flex-col gap-2 mb-4 border-b pb-2">
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" checked={isChecked} onChange={(e) => {
                                            if (e.target.checked) setRecipe({...recipe, ingredients: [...recipe.ingredients, {...ing, amount: "", unit: "", multiplier: 1}]});
                                            else setRecipe({...recipe, ingredients: recipe.ingredients.filter((a: any) => a._id !== ing._id)});
                                        }} />
                                        <span>{ing.en} / {ing.es}</span>
                                    </label>
                                    {isChecked && (
                                        <div className="flex gap-2 items-center pl-6">
                                            <input type="number" placeholder="Amt" className="input input-bordered input-sm w-20" onChange={(e) => {
                                                setRecipe({...recipe, ingredients: recipe.ingredients.map((a: any) => a._id === ing._id ? {...a, amount: e.target.value} : a)});
                                            }} />
                                            <select className="select select-bordered select-sm" onChange={(e) => {
                                                const mult = getMultiplier(unitsList, e.target.value, ing.packageSizeUnit);
                                                setRecipe({...recipe, ingredients: recipe.ingredients.map((a: any) => a._id === ing._id ? {...a, unit: e.target.value, multiplier: mult} : a)});
                                            }}>
                                                <option value="">Unit</option>
                                                {unitsList.map(u => <option key={u.fromUnit} value={u.fromUnit}>{u.fromUnit}</option>)}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex gap-4">
                        <button type="button" className="btn flex-1" onClick={onClose}>{t.cancel}</button>
                        <button type="submit" className="btn btn-success flex-1" disabled={isSubmitting}>{isSubmitting ? t.submitting : t.submit}</button>
                    </div>
                </form>
            </div>
        </dialog>
    );
}