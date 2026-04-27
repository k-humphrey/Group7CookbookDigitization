"use client";

import { useState, useEffect } from "react";
import InfoCard from "@/app/components/infocard";

const PAGE_SIZE = 12; // 4 rows x 3 columns

export default function IngredientSelector() {
    const [ingredients, setIngredients] = useState<any[]>([]);
    const [modalIngredient, setModalIngredient] = useState<any | null>(null);
    const [ingredientSearch, setIngredientSearch] = useState("");
    const [unitsList, setUnitsList] = useState<any[]>([]);
    const [page, setPage] = useState(0);

    // fetch ingredients
    useEffect(() => {
        fetch("/api/ingredients")
            .then(res => res.json())
            .then(data => setIngredients(data));

        fetch("/api/units")
            .then(res => res.json())
            .then(data => setUnitsList(data.uniqueUnits));

    }, []);

    const refreshIngredients = async () => {
        await fetch("/api/ingredients")
            .then(res => res.json())
            .then(data => setIngredients(data));
    };

    const emptyIngredient = {
        en: "",
        es: "",
        baseUnit: "",
        productLink: "",
        price: 0,
        storeName: "",
        packageSize: 1
    };

    // calculate pagination information
    const searchedIngredients = ingredients.filter(ingredient => ingredient.en.toLowerCase().includes(ingredientSearch.toLowerCase()) || ingredient.es.toLowerCase().includes(ingredientSearch.toLowerCase()));
    const totalPages = Math.ceil(searchedIngredients.length / PAGE_SIZE);
    const pageIngredients = searchedIngredients.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

    // unique units
    const uniqueUnits = [...new Set([...unitsList.map(unit => unit.fromUnit), ...unitsList.map(unit => unit.toUnit)])];

    return (
        <>
            <div className="flex flex-col items-center w-full">
                {/* Selection Info */}
                <div className="justify-between w-full flex max-w-6xl mb-4 px-6">
                    <h2 className="text-xl font-semibold">
                        Ingredients
                    </h2>

                    <button className="btn btn-success"
                        onClick={() => setModalIngredient({ ...emptyIngredient })}
                    >
                        + Create New Ingredient
                    </button>
                </div>

                {/* Search Bar */}
                <div className="w-full max-w-6xl px-6 mb-4">
                    <input
                        type="text"
                        placeholder="Search ingredients..."
                        className="input input-bordered w-full"
                        value={ingredientSearch}
                        onChange={(e) => {
                            setIngredientSearch(e.target.value);
                            setPage(0);
                        }}
                    />
                </div>

                {/* Ingredient Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl p-6">
                    {pageIngredients.map(ingredient => (
                        <InfoCard
                            key={ingredient._id}
                            title={ingredient.en}
                            description=""
                            href="#"
                            action={
                                <button className="btn btn-primary btn-sm"
                                    onClick={() => setModalIngredient({ ...ingredient })}
                                >
                                    Edit
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

            {/* MODAL */}
            {modalIngredient && (
                <dialog className="modal modal-open"
                    onClick={() => setModalIngredient(null)}
                >
                    <form
                        className="modal-box max-w-3xl max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                        onSubmit={async (e) => {
                            e.preventDefault();

                            await fetch("/api/ingredients", {
                                method: modalIngredient._id ? "PUT" : "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    ...modalIngredient
                                })
                            });

                            setModalIngredient(null);
                            refreshIngredients();
                        }}
                    >
                        <h3 className="font-bold text-2xl mb-6">{modalIngredient._id ? "Edit Ingredient" : "Add Ingredient"}</h3>

                        {/* Fields */}
                        {["en","es","price","packageSize"].map(field => {
                            const isNumber = ["price","packageSize"].includes(field);
                            return (
                                <div className="mb-4" key={field}>
                                    <label className="font-semibold">{field}:</label>
                                    <input
                                        type={isNumber ? "number" : "text"}
                                        step={field === "price" ? "0.01" : undefined}
                                        className="input input-bordered w-full"
                                        value={modalIngredient[field] || ""}
                                        onChange={e => setModalIngredient({
                                            ...modalIngredient,
                                            [field]: isNumber ? parseFloat(e.target.value) : e.target.value
                                        })}
                                        required={["en", "es", "packageSize"].includes(field)}
                                    />
                                </div>
                            )
                        })}

                        {/* BASE UNIT */}
                        <div className="mb-4">
                            <label className="font-semibold">baseUnit: </label>
                            <select
                                className="select select-bordered w-1/2"
                                value={modalIngredient.baseUnit || ""}
                                onChange={(e) => 
                                    setModalIngredient({ ...modalIngredient, baseUnit: e.target.value })
                                }
                                required
                            >
                                <option value="">
                                    Unit
                                </option>
                                {uniqueUnits.map((unit) => (
                                    <option key={unit} value={unit}>
                                        {unit}
                                    </option>
                                ))} 
                            </select>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 mt-8">
                            <button type="button" className="btn btn-secondary flex-1" onClick={() => setModalIngredient(null)}>Cancel</button>
                            <button type="submit" className="btn btn-primary flex-1" onClick={() => location.reload()}>Save</button>
                        </div>
                    </form>
                </dialog>
            )}
        </>
    );
}