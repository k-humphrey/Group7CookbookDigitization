// app/components/submittedRecipeSelector.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import InfoCard from "@/app/components/infocard";

type Lang = "en" | "es";

type LocalizedText = {
    en: string;
    es: string;
};

type SubmittedRecipe = {
    _id: string;
    title: LocalizedText;
    ingredientPlainText: LocalizedText;
    instructions: LocalizedText;
    imageURI?: string;
    public_id?: string;
    tags?: string[];
    allergens?: string[];
    appliances?: string[];
    ingredients?: SubmittedIngredient[];
    submittedFromLang?: Lang;
    status?: "pending" | "approved" | "rejected";
};

type NamedOption = {
    _id: string;
    en: string;
    es: string;
};

type IngredientOption = {
  _id: string;
  en: string;
  es: string;
  costPerUnit?: number;
  baseUnit?: string;
};

type SubmittedIngredient = {
  ingredient: string;
  amount: number;
  unit: string;
  multiplier: number;
};

const EMPTY_LOCALIZED_TEXT: LocalizedText = { en: "", es: "" };
//const EMPTY_LOCALIZED_ARRAY: LocalizedArray = { en: [], es: [] };
const EMPTY_ID_ARRAY: string[] = [];

export default function SubmittedRecipeSelector() {
const [recipes, setRecipes] = useState<SubmittedRecipe[]>([]);
const [modalRecipe, setModalRecipe] = useState<SubmittedRecipe | null>(null);

const [tagsList, setTagsList] = useState<NamedOption[]>([]);
const [allergensList, setAllergensList] = useState<NamedOption[]>([]);
const [appliancesList, setAppliancesList] = useState<NamedOption[]>([]);
const [ingredientsList, setIngredientsList] = useState<IngredientOption[]>([]);

const [isLoading, setIsLoading] = useState(true);
const [isSaving, setIsSaving] = useState(false);
const [isApproving, setIsApproving] = useState(false);
const [isDeleting, setIsDeleting] = useState(false);
const [isUploadingImage, setIsUploadingImage] = useState(false);
const [errorMessage, setErrorMessage] = useState("");
const [showOtherLanguage, setShowOtherLanguage] = useState(false);

const [statusFilter, setStatusFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");

const emptyLocalizedText = useMemo(() => ({ ...EMPTY_LOCALIZED_TEXT }), []);

    const fetchRecipes = async () => {
        try {
        setIsLoading(true);
        setErrorMessage("");

        const query = statusFilter === "all" ? "" : `?status=${statusFilter}`;
        const res = await fetch(`/api/submitted-recipes${query}`);
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data?.error || "Failed to fetch submitted recipes.");
        }

        setRecipes(Array.isArray(data) ? data : []);
        } catch (error) {
        setRecipes([]);
        setErrorMessage(
            error instanceof Error
            ? error.message
            : "Failed to fetch submitted recipes."
        );
        } finally {
        setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes();

        fetch("/api/submitted-recipes/tags")
        .then((res) => res.json())
        .then((data) => setTagsList(Array.isArray(data) ? data : []))
        .catch(() => setTagsList([]));

        fetch("/api/submitted-recipes/allergens")
        .then((res) => res.json())
        .then((data) => setAllergensList(Array.isArray(data) ? data : []))
        .catch(() => setAllergensList([]));

        fetch("/api/appliances/all")
        .then((res) => res.json())
        .then((data) => setAppliancesList(Array.isArray(data) ? data : []))
        .catch(() => setAppliancesList([]));

        fetch("/api/ingredients")
        .then((res) => res.json())
        .then((data) => setIngredientsList(Array.isArray(data) ? data : []))
        .catch(() => setIngredientsList([]));
    }, [statusFilter]);

    const getPrimaryLang = (recipe: SubmittedRecipe | null): Lang => {
        if (!recipe?.submittedFromLang) return "en";
        return recipe.submittedFromLang;
    };

    const getSecondaryLang = (recipe: SubmittedRecipe | null): Lang => {
        return getPrimaryLang(recipe) === "en" ? "es" : "en";
    };

    const getRecipeDisplayTitle = (recipe: SubmittedRecipe) => {
        return (
        recipe.title?.en?.trim() ||
        recipe.title?.es?.trim() ||
        "Untitled Submitted Recipe"
        );
    };

    const getRecipeDisplayDescription = (recipe: SubmittedRecipe) => {
        const text =
        recipe.ingredientPlainText?.en?.trim() ||
        recipe.ingredientPlainText?.es?.trim() ||
        "";

        return text.length > 100 ? `${text.slice(0, 100)}...` : text;
    };

    const validateRecipe = (recipe: SubmittedRecipe) => {
        const hasTitle = recipe.title?.en?.trim() || recipe.title?.es?.trim();
        const hasIngredients =
        recipe.ingredientPlainText?.en?.trim() ||
        recipe.ingredientPlainText?.es?.trim();
        const hasInstructions =
        recipe.instructions?.en?.trim() ||
        recipe.instructions?.es?.trim();

        if (!hasTitle) return "At least one title is required.";
        if (!hasIngredients) return "At least one ingredients field is required.";
        if (!hasInstructions) return "At least one instructions field is required.";

        return "";
    };

    const asIdArray = (value: unknown): string[] => {
        if (!Array.isArray(value)) return [];

        return value
            .map((item: any) =>
            typeof item === "string"
                ? item
                : item?._id?.toString?.() ?? item?.toString?.() ?? ""
            )
            .filter(Boolean);
        };

    const asSubmittedIngredients = (value: unknown): SubmittedIngredient[] => {
        if (!Array.isArray(value)) return [];

        return value
            .map((item: any) => ({
            ingredient:
                typeof item?.ingredient === "string"
                ? item.ingredient
                : item?.ingredient?._id?.toString?.() ?? item?.ingredient?.toString?.() ?? "",
            amount: Number(item?.amount) || 0,
            unit: typeof item?.unit === "string" ? item.unit : "",
            multiplier: Number(item?.multiplier) || 1,
            }))
            .filter((item) => item.ingredient);
        };

    const openModal = (recipe: SubmittedRecipe) => {
        setErrorMessage("");
        setShowOtherLanguage(false);

        setModalRecipe({
        ...recipe,
        title: recipe.title ?? emptyLocalizedText,
        ingredientPlainText: recipe.ingredientPlainText ?? emptyLocalizedText,
        instructions: recipe.instructions ?? emptyLocalizedText,
        tags: asIdArray(recipe.tags),
        allergens: asIdArray(recipe.allergens),
        appliances: asIdArray(recipe.appliances),
        ingredients: asSubmittedIngredients(recipe.ingredients),
        });
    };

    const closeModal = () => {
        setModalRecipe(null);
        setErrorMessage("");
        setShowOtherLanguage(false);
    };

    const handleImageUpload = async (file: File) => {
        if (!modalRecipe) return;

        try {
            setErrorMessage("");
            setIsUploadingImage(true);

            const formData = new FormData();
            formData.append("file", file);

            const hasExistingImage = Boolean(modalRecipe.public_id);

            if (hasExistingImage) {
            formData.append("public_id", modalRecipe.public_id!);
            }

            const res = await fetch("/api/upload-images", {
            method: hasExistingImage ? "PUT" : "POST",
            body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
            throw new Error(data?.error || "Failed to upload image.");
            }

            setModalRecipe((prev) =>
            prev
                ? {
                    ...prev,
                    imageURI: data.url || "",
                    public_id: data.public_id || "",
                }
                : prev
            );
        } catch (error) {
            setErrorMessage(
            error instanceof Error ? error.message : "Failed to upload image."
            );
        } finally {
            setIsUploadingImage(false);
        }
        };

    const renderTextField = (
        id: string,
        label: string,
        value: string,
        onChange: (value: string) => void,
        multiline = false
    ) => {
        if (multiline) {
        return (
            <>
            <label className="font-semibold block mb-1" htmlFor={id}>
                {label}
            </label>
            <textarea
                id={id}
                className="textarea textarea-bordered w-full mb-4"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            </>
        );
        }

        return (
        <>
            <label className="font-semibold block mb-1" htmlFor={id}>
            {label}
            </label>
            <input
                id={id}
                className="input input-bordered w-full mb-4"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </>
        );
    };

    return (
        <>
        <div className="p-6 w-full">
            <h2 className="text-xl font-bold mb-4">Submitted Recipes</h2>

            <div className="mb-4">
            <label className="font-semibold block mb-1" htmlFor="statusFilter">
                Status
            </label>

            <select
                id="statusFilter"
                className="select select-bordered w-full max-w-xs"
                value={statusFilter}
                onChange={(e) =>
                setStatusFilter(
                    e.target.value as "pending" | "approved" | "rejected" | "all"
                )
                }
            >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="all">All</option>
            </select>
            </div>

            {errorMessage && !modalRecipe && (
            <div className="alert alert-error mb-4">
                <span>{errorMessage}</span>
            </div>
            )}

            {isLoading ? (
            <p>Loading submitted recipes...</p>
            ) : recipes.length === 0 ? (
            <p>No submitted recipes found.</p>
            ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recipes.map((recipe) => (
                <li key={recipe._id}>
                    <InfoCard
                    title={getRecipeDisplayTitle(recipe)}
                    description={getRecipeDisplayDescription(recipe)}
                    imageSrc={recipe.imageURI}
                    href="#"
                    action={
                        <div className="flex gap-2 flex-wrap">
                        <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => openModal(recipe)}
                            disabled={isApproving || isDeleting || isSaving}
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            className="btn btn-success btn-sm"
                            onClick={async () => {
                            try {
                                setErrorMessage("");
                                setIsApproving(true);

                                const res = await fetch(
                                "/api/submitted-recipes/approve",
                                {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ _id: recipe._id }),
                                }
                                );

                                const data = await res.json();

                                if (!res.ok) {
                                throw new Error(
                                    data?.error || "Failed to approve submitted recipe."
                                );
                                }

                                await fetchRecipes();
                            } catch (error) {
                                setErrorMessage(
                                error instanceof Error
                                    ? error.message
                                    : "Failed to approve submitted recipe."
                                );
                            } finally {
                                setIsApproving(false);
                            }
                            }}
                            disabled={isApproving || isDeleting || isSaving}
                        >
                            {isApproving ? "Approving..." : "Approve"}
                        </button>

                        <button
                            type="button"
                            className="btn btn-error btn-sm"
                            onClick={async () => {
                            try {
                                setErrorMessage("");
                                setIsDeleting(true);

                                const res = await fetch(
                                `/api/submitted-recipes?_id=${recipe._id}`,
                                {
                                    method: "DELETE",
                                }
                                );

                                const data = await res.json();

                                if (!res.ok) {
                                throw new Error(
                                    data?.error || "Failed to delete submitted recipe."
                                );
                                }

                                await fetchRecipes();
                            } catch (error) {
                                setErrorMessage(
                                error instanceof Error
                                    ? error.message
                                    : "Failed to delete submitted recipe."
                                );
                            } finally {
                                setIsDeleting(false);
                            }
                            }}
                            disabled={isApproving || isDeleting || isSaving}
                        >
                            Delete
                        </button>
                        </div>
                    }
                    />
                </li>
                ))}
            </ul>
            )}
        </div>

        {modalRecipe && (
            <dialog className="modal modal-open" onClick={closeModal}>
            <div
                className="modal-box max-w-3xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <form
                onSubmit={async (e) => {
                    e.preventDefault();

                    const validationError = validateRecipe(modalRecipe);
                    if (validationError) {
                    setErrorMessage(validationError);
                    return;
                    }

                    try {
                    setErrorMessage("");
                    setIsSaving(true);

                    const res = await fetch("/api/submitted-recipes", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                        _id: modalRecipe._id,
                        title: modalRecipe.title,
                        ingredientPlainText: modalRecipe.ingredientPlainText,
                        instructions: modalRecipe.instructions,
                        imageURI: modalRecipe.imageURI ?? "",
                        public_id: modalRecipe.public_id ?? "",
                        tags: modalRecipe.tags ?? EMPTY_ID_ARRAY,
                        allergens: modalRecipe.allergens ?? EMPTY_ID_ARRAY,
                        appliances: modalRecipe.appliances ?? EMPTY_ID_ARRAY,
                        ingredients: modalRecipe.ingredients ?? [],
                        submittedFromLang:
                            modalRecipe.submittedFromLang ?? "en",
                        status: modalRecipe.status ?? "pending",
                        }),
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        throw new Error(
                        data?.error || "Failed to save submitted recipe."
                        );
                    }

                    closeModal();
                    await fetchRecipes();
                    } catch (error) {
                    setErrorMessage(
                        error instanceof Error
                        ? error.message
                        : "Failed to save submitted recipe."
                    );
                    } finally {
                    setIsSaving(false);
                    }
                }}
                >
                <h3 className="font-bold text-2xl mb-6">Edit Submitted Recipe</h3>

                {errorMessage && (
                    <div className="alert alert-error mb-4">
                    <span>{errorMessage}</span>
                    </div>
                )}

                <div className="mb-6">
                    <label className="font-semibold block mb-2">Recipe Image</label>

                    {modalRecipe.imageURI ? (
                    <div className="mb-4">
                        <img
                        src={modalRecipe.imageURI}
                        alt="Submitted recipe"
                        className="w-full max-h-72 object-cover rounded mb-3"
                        />

                        <div className="flex gap-2 flex-wrap">
                        <label className="btn btn-outline btn-sm cursor-pointer">
                            Replace Image
                            <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) await handleImageUpload(file);
                            }}
                            />
                        </label>

                        <button
                            type="button"
                            className="btn btn-error btn-sm"
                            onClick={() =>
                            setModalRecipe((prev) =>
                                prev
                                ? {
                                    ...prev,
                                    imageURI: "",
                                    public_id: "",
                                    }
                                : prev
                            )
                            }
                        >
                            Remove Image
                        </button>
                        </div>
                    </div>
                    ) : (
                    <div className="flex flex-col gap-2 mb-4">
                        <label className="btn btn-outline btn-sm w-fit cursor-pointer">
                        Upload Image
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) await handleImageUpload(file);
                            }}
                        />
                        </label>
                    </div>
                    )}

                    {isUploadingImage && (
                    <p className="text-sm mt-2">Uploading image...</p>
                    )}
                </div>

                <div className="border rounded-lg p-4 mb-6">
                    <h4 className="font-bold text-lg mb-4">
                    {getPrimaryLang(modalRecipe) === "en" ? "English" : "Español"}
                    </h4>

                    {renderTextField(
                    "submittedTitlePrimary",
                    `Title (${getPrimaryLang(modalRecipe) === "en" ? "English" : "Español"})`,
                    modalRecipe.title[getPrimaryLang(modalRecipe)],
                    (value) =>
                        setModalRecipe((prev) =>
                        prev
                            ? {
                                ...prev,
                                title: {
                                ...prev.title,
                                [getPrimaryLang(prev)]: value,
                                },
                            }
                            : prev
                        )
                    )}

                    {renderTextField(
                    "submittedIngredientsPrimary",
                    `Ingredients (${getPrimaryLang(modalRecipe) === "en" ? "English" : "Español"})`,
                    modalRecipe.ingredientPlainText[getPrimaryLang(modalRecipe)],
                    (value) =>
                        setModalRecipe((prev) =>
                        prev
                            ? {
                                ...prev,
                                ingredientPlainText: {
                                ...prev.ingredientPlainText,
                                [getPrimaryLang(prev)]: value,
                                },
                            }
                            : prev
                        ),
                    true
                    )}

                    {renderTextField(
                    "submittedInstructionsPrimary",
                    `Instructions (${getPrimaryLang(modalRecipe) === "en" ? "English" : "Español"})`,
                    modalRecipe.instructions[getPrimaryLang(modalRecipe)],
                    (value) =>
                        setModalRecipe((prev) =>
                        prev
                            ? {
                                ...prev,
                                instructions: {
                                ...prev.instructions,
                                [getPrimaryLang(prev)]: value,
                                },
                            }
                            : prev
                        ),
                    true
                    )}
                </div>

                <button
                    type="button"
                    className="btn btn-outline mb-6"
                    onClick={() => setShowOtherLanguage((prev) => !prev)}
                >
                    {showOtherLanguage
                    ? `Hide ${getSecondaryLang(modalRecipe) === "en" ? "English" : "Spanish"}`
                    : `Add ${getSecondaryLang(modalRecipe) === "en" ? "English" : "Spanish"}`}
                </button>

                {showOtherLanguage && (
                    <div className="border rounded-lg p-4 mb-6">
                    <h4 className="font-bold text-lg mb-4">
                        {getSecondaryLang(modalRecipe) === "en" ? "English" : "Español"}
                    </h4>

                    {renderTextField(
                        "submittedTitleSecondary",
                        `Title (${getSecondaryLang(modalRecipe) === "en" ? "English" : "Español"})`,
                        modalRecipe.title[getSecondaryLang(modalRecipe)],
                        (value) =>
                        setModalRecipe((prev) =>
                            prev
                            ? {
                                ...prev,
                                title: {
                                    ...prev.title,
                                    [getSecondaryLang(prev)]: value,
                                },
                                }
                            : prev
                        )
                    )}

                    {renderTextField(
                        "submittedIngredientsSecondary",
                        `Ingredients (${getSecondaryLang(modalRecipe) === "en" ? "English" : "Español"})`,
                        modalRecipe.ingredientPlainText[getSecondaryLang(modalRecipe)],
                        (value) =>
                        setModalRecipe((prev) =>
                            prev
                            ? {
                                ...prev,
                                ingredientPlainText: {
                                    ...prev.ingredientPlainText,
                                    [getSecondaryLang(prev)]: value,
                                },
                                }
                            : prev
                        ),
                        true
                    )}

                    {renderTextField(
                        "submittedInstructionsSecondary",
                        `Instructions (${getSecondaryLang(modalRecipe) === "en" ? "English" : "Español"})`,
                        modalRecipe.instructions[getSecondaryLang(modalRecipe)],
                        (value) =>
                        setModalRecipe((prev) =>
                            prev
                            ? {
                                ...prev,
                                instructions: {
                                    ...prev.instructions,
                                    [getSecondaryLang(prev)]: value,
                                },
                                }
                            : prev
                        ),
                        true
                    )}
                    </div>
                )}

                <h4 className="font-bold mt-6 mb-2">Structured Ingredients</h4>

                    <div className="mb-4 space-y-3">
                    {(modalRecipe.ingredients ?? []).map((item, index) => (
                        <div key={index} className="grid grid-cols-4 gap-2">
                        <select
                            className="select select-bordered"
                            value={item.ingredient}
                            onChange={(e) =>
                            setModalRecipe((prev) => {
                                if (!prev) return prev;

                                const ingredients = [...(prev.ingredients ?? [])];
                                const selected = ingredientsList.find(
                                (ingredient) => ingredient._id === e.target.value
                                );

                                ingredients[index] = {
                                ...ingredients[index],
                                ingredient: e.target.value,
                                unit: selected?.baseUnit || ingredients[index].unit,
                                };

                                return { ...prev, ingredients };
                            })
                            }
                        >
                            <option value="">Select ingredient</option>
                            {ingredientsList.map((ingredient) => (
                            <option key={ingredient._id} value={ingredient._id}>
                                {ingredient.en} / {ingredient.es}
                            </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            className="input input-bordered"
                            placeholder="Amount"
                            value={item.amount}
                            onChange={(e) =>
                            setModalRecipe((prev) => {
                                if (!prev) return prev;

                                const ingredients = [...(prev.ingredients ?? [])];
                                ingredients[index] = {
                                ...ingredients[index],
                                amount: Number(e.target.value),
                                };

                                return { ...prev, ingredients };
                            })
                            }
                        />

                        <input
                            className="input input-bordered"
                            placeholder="Unit"
                            value={item.unit}
                            onChange={(e) =>
                            setModalRecipe((prev) => {
                                if (!prev) return prev;

                                const ingredients = [...(prev.ingredients ?? [])];
                                ingredients[index] = {
                                ...ingredients[index],
                                unit: e.target.value,
                                };

                                return { ...prev, ingredients };
                            })
                            }
                        />

                        <button
                            type="button"
                            className="btn btn-error"
                            onClick={() =>
                            setModalRecipe((prev) =>
                                prev
                                ? {
                                    ...prev,
                                    ingredients: (prev.ingredients ?? []).filter(
                                        (_, i) => i !== index
                                    ),
                                    }
                                : prev
                            )
                            }
                        >
                            Remove
                        </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() =>
                        setModalRecipe((prev) =>
                            prev
                            ? {
                                ...prev,
                                ingredients: [
                                    ...(prev.ingredients ?? []),
                                    {
                                    ingredient: "",
                                    amount: 0,
                                    unit: "",
                                    multiplier: 1,
                                    },
                                ],
                                }
                            : prev
                        )
                        }
                    >
                        Add Ingredient
                    </button>
                    </div>

                <h4 className="font-bold mt-6 mb-2">Tags</h4>
                {tagsList.map((tag) => {
                    const tagId = String(tag._id);
                    const selectedTags = asIdArray(modalRecipe.tags);
                    const isChecked = selectedTags.includes(tagId);

                    return (
                        <label key={tagId} className="flex gap-2 mb-2">
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) =>
                            setModalRecipe((prev) =>
                                prev
                                ? {
                                    ...prev,
                                    tags: e.target.checked
                                        ? selectedTags.includes(tagId)
                                        ? selectedTags
                                        : [...selectedTags, tagId]
                                        : selectedTags.filter((id) => id !== tagId),
                                    }
                                : prev
                            )
                            }
                        />
                        <span>{tag.en} / {tag.es}</span>
                        </label>
                    );
                    })}
                <h4 className="font-bold mt-6 mb-2">Allergens</h4>
                {allergensList.map((allergen) => {
                    const selectedAllergens = asIdArray(modalRecipe.allergens);
                    const isChecked = selectedAllergens.includes(String(allergen._id));
                    return (
                    <label key={allergen._id} className="flex gap-2 mb-2">
                        <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) =>
                        setModalRecipe((prev) =>
                            prev
                            ? {
                                ...prev,
                                allergens: e.target.checked
                                    ? asIdArray(prev.allergens).includes(allergen._id)
                                    ? asIdArray(prev.allergens)
                                    : [...asIdArray(prev.allergens), allergen._id]
                                    : asIdArray(prev.allergens).filter((id) => id !== allergen._id),
                                }
                            : prev
                        )
                        }
                        />
                        <span>
                        {allergen.en} / {allergen.es}
                        </span>
                    </label>
                    );
                })}

                <h4 className="font-bold mt-6 mb-2">Appliances</h4>
                {appliancesList.map((appliance) => {
                    const isChecked = (modalRecipe.appliances ?? []).includes(appliance._id);

                    return (
                    <label key={appliance._id} className="flex gap-2 mb-2">
                        <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) =>
                        setModalRecipe((prev) =>
                            prev
                            ? {
                                ...prev,
                                appliances: e.target.checked
                                    ? (prev.appliances ?? []).includes(appliance._id)
                                    ? prev.appliances ?? []
                                    : [...(prev.appliances ?? []), appliance._id]
                                    : (prev.appliances ?? []).filter((id) => id !== appliance._id),
                                }
                            : prev
                        )
                        }
                        />
                        <span>
                        {appliance.en} / {appliance.es}
                        </span>
                    </label>
                    );
                })}

                <label className="font-semibold mt-6 block" htmlFor="submittedFromLang">
                    Submitted From Language:
                </label>
                <select
                    id="submittedFromLang"
                    className="select select-bordered w-full mb-4"
                    value={modalRecipe.submittedFromLang ?? "en"}
                    onChange={(e) =>
                    setModalRecipe({
                        ...modalRecipe,
                        submittedFromLang: e.target.value as Lang,
                    })
                    }
                >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                </select>

                <label className="font-semibold mt-6 block" htmlFor="submittedStatus">
                    Status:
                </label>
                <select
                    id="submittedStatus"
                    className="select select-bordered w-full mb-4"
                    value={modalRecipe.status ?? "pending"}
                    onChange={(e) =>
                    setModalRecipe({
                        ...modalRecipe,
                        status: e.target.value as
                        | "pending"
                        | "approved"
                        | "rejected",
                    })
                    }
                >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>

                <div className="flex gap-4 mt-8">
                    <button
                    type="button"
                    className="btn btn-secondary flex-1"
                    onClick={closeModal}
                    disabled={isSaving || isDeleting || isUploadingImage}
                    >
                    Cancel
                    </button>

                    <button
                    type="submit"
                    className="btn btn-primary flex-1"
                    disabled={isSaving || isDeleting || isUploadingImage}
                    >
                    {isSaving ? "Saving..." : "Save"}
                    </button>

                    <button
                    type="button"
                    className="btn btn-error flex-1"
                    disabled={isSaving || isDeleting || isUploadingImage}
                    onClick={async () => {
                        try {
                        setErrorMessage("");
                        setIsDeleting(true);

                        const res = await fetch(
                            `/api/submitted-recipes?_id=${modalRecipe._id}`,
                            {
                            method: "DELETE",
                            }
                        );

                        const data = await res.json();

                        if (!res.ok) {
                            throw new Error(
                            data?.error || "Failed to delete submitted recipe."
                            );
                        }

                        closeModal();
                        await fetchRecipes();
                        } catch (error) {
                        setErrorMessage(
                            error instanceof Error
                            ? error.message
                            : "Failed to delete submitted recipe."
                        );
                        } finally {
                        setIsDeleting(false);
                        }
                    }}
                    >
                    {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
                </form>
            </div>
            </dialog>
        )}
        </>
    );
}