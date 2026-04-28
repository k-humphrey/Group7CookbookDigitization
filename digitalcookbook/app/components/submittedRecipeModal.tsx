// app/components/submittedRecipeModal.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/app/components/languageprovider";

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
        addOtherLanguage: "Add Spanish",
        hideOtherLanguage: "Hide Spanish",
        english: "English",
        spanish: "Spanish",
        cancel: "Cancel",
        submit: "Submit",
        submitting: "Submitting...",
        uploadingImage: "Uploading image...",
        removeImage: "Remove Image",
        requiredError: "Please fill in title, ingredients, and instructions in at least one language.",
        uploadError: "Image upload failed.",
        submitError: "Recipe submission failed.",
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
        addOtherLanguage: "Agregar inglés",
        hideOtherLanguage: "Ocultar inglés",
        english: "Inglés",
        spanish: "Español",
        cancel: "Cancelar",
        submit: "Enviar",
        submitting: "Enviando...",
        uploadingImage: "Subiendo imagen...",
        removeImage: "Quitar imagen",
        requiredError: "Complete título, ingredientes e instrucciones en al menos un idioma.",
        uploadError: "La carga de la imagen falló.",
        submitError: "No se pudo enviar la receta.",
        success: "Receta enviada con éxito.",
    },
    } as const;

type Lang = "en" | "es";

type NamedOption = {
    _id: string;
    en: string;
    es: string;
};

type LocalizedText = {
    en: string;
    es: string;
};

type LocalizedArray = {
    en: string[];
    es: string[];
};

type SubmittedRecipe = {
    title: LocalizedText;
    ingredientPlainText: LocalizedText;
    instructions: LocalizedText;
    imageURI: string;
    public_id: string;
    tags: LocalizedArray;
    allergens: LocalizedArray;
    appliances: LocalizedArray;
    submittedFromLang?: Lang;
};

type SubmittedRecipeModalProps = {
    open: boolean;
    onClose: () => void;
};

const EMPTY_LOCALIZED_TEXT: LocalizedText = { en: "", es: "" };
const EMPTY_LOCALIZED_ARRAY: LocalizedArray = { en: [], es: [] };

const createEmptySubmittedRecipe = (): SubmittedRecipe => ({
    title: { ...EMPTY_LOCALIZED_TEXT },
    ingredientPlainText: { ...EMPTY_LOCALIZED_TEXT },
    instructions: { ...EMPTY_LOCALIZED_TEXT },
    imageURI: "",
    public_id: "",
    tags: { ...EMPTY_LOCALIZED_ARRAY },
    allergens: { ...EMPTY_LOCALIZED_ARRAY },
    appliances: { ...EMPTY_LOCALIZED_ARRAY },
    submittedFromLang: "en",
});

export default function SubmittedRecipeModal({
    open,
    onClose,
    }: SubmittedRecipeModalProps) {
    const langContext = useLang();
    const lang: Lang = langContext?.lang ?? "en";
    const t = STRINGS[lang];

    const primaryLang: Lang = lang;
    const secondaryLang: Lang = lang === "en" ? "es" : "en";

    const [showOtherLanguage, setShowOtherLanguage] = useState(false);

    const [tagsList, setTagsList] = useState<NamedOption[]>([]);
    const [allergensList, setAllergensList] = useState<NamedOption[]>([]);
    const [appliancesList, setAppliancesList] = useState<NamedOption[]>([]);

    const emptySubmittedRecipe = useMemo(() => createEmptySubmittedRecipe(), []);
    const [submittedRecipe, setSubmittedRecipe] =
        useState<SubmittedRecipe>(emptySubmittedRecipe);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!open) return;

        setSubmittedRecipe({
        ...createEmptySubmittedRecipe(),
        submittedFromLang: primaryLang,
        });
        setError("");
        setSuccess("");
        setShowOtherLanguage(false);

        fetch("/api/tags/all")
        .then((res) => res.json())
        .then((data) => setTagsList(Array.isArray(data) ? data : []))
        .catch(() => setTagsList([]));

        fetch("/api/allergens/all")
        .then((res) => res.json())
        .then((data) => setAllergensList(Array.isArray(data) ? data : []))
        .catch(() => setAllergensList([]));

        fetch("/api/appliances/all")
        .then((res) => res.json())
        .then((data) => setAppliancesList(Array.isArray(data) ? data : []))
        .catch(() => setAppliancesList([]));
    }, [open, primaryLang]);

    if (!open) return null;

    const validateForm = () => {
        const hasTitle =
        submittedRecipe.title.en.trim() || submittedRecipe.title.es.trim();
        const hasIngredients =
        submittedRecipe.ingredientPlainText.en.trim() ||
        submittedRecipe.ingredientPlainText.es.trim();
        const hasInstructions =
        submittedRecipe.instructions.en.trim() ||
        submittedRecipe.instructions.es.trim();

        if (!hasTitle || !hasIngredients || !hasInstructions) {
        setError(t.requiredError);
        return false;
        }

        return true;
    };

    const toggleLocalizedPair = (
        current: LocalizedArray,
        enValue: string,
        esValue: string,
        checked: boolean
    ): LocalizedArray => {
        const addOrRemove = (list: string[], value: string) =>
        checked
            ? list.includes(value)
            ? list
            : [...list, value]
            : list.filter((item) => item !== value);

        return {
        en: addOrRemove(current.en, enValue),
        es: addOrRemove(current.es, esValue),
        };
    };

    const handleImageUpload = async (file: File) => {
        setError("");
        setIsUploadingImage(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload-submitted-recipe-image", {
            method: "POST",
            body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
            throw new Error(data?.error || t.uploadError);
            }

            setSubmittedRecipe((prev) => ({
            ...prev,
            imageURI: data.url || "",
            public_id: data.public_id || "",
            }));
        } catch (err) {
            setError(err instanceof Error ? err.message : t.uploadError);
        } finally {
            setIsUploadingImage(false);
        }
    };

    const resetAndClose = () => {
        setSubmittedRecipe({
        ...createEmptySubmittedRecipe(),
        submittedFromLang: primaryLang,
        });
        setShowOtherLanguage(false);
        setError("");
        setSuccess("");
        onClose();
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
        <dialog
        className="modal modal-open flex items-center justify-center p-4"
        onClick={resetAndClose}
        >
        <div
            className="modal-box mx-auto w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-white text-black"
            onClick={(e) => e.stopPropagation()}
        >
            <form
            className="pb-6"
            onSubmit={async (e) => {
                e.preventDefault();
                setError("");
                setSuccess("");

                if (!validateForm()) return;

                try {
                setIsSubmitting(true);

                const res = await fetch("/api/submitted-recipes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                    ...submittedRecipe,
                    submittedFromLang: primaryLang,
                    }),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data?.error || t.submitError);
                }

                setSuccess(t.success);
                setSubmittedRecipe({
                    ...createEmptySubmittedRecipe(),
                    submittedFromLang: primaryLang,
                });
                setShowOtherLanguage(false);

                setTimeout(() => {
                    onClose();
                }, 800);
                } catch (err) {
                setError(err instanceof Error ? err.message : t.submitError);
                } finally {
                setIsSubmitting(false);
                }
            }}
            >
            <h3 className="font-bold text-2xl mb-6">{t.title}</h3>

            {error && (
                <div className="alert alert-error mb-4">
                <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="alert alert-success mb-4">
                <span>{success}</span>
                </div>
            )}

            <div className="border rounded-lg p-4 mb-6">
                <h4 className="font-bold text-lg mb-4">
                {primaryLang === "en" ? t.english : t.spanish}
                </h4>

                {renderTextField(
                "submitRecipeTitlePrimary",
                `${t.recipeTitle} (${primaryLang === "en" ? t.english : t.spanish})`,
                submittedRecipe.title[primaryLang],
                (value) =>
                    setSubmittedRecipe((prev) => ({
                    ...prev,
                    title: { ...prev.title, [primaryLang]: value },
                    }))
                )}

                {renderTextField(
                "submitRecipeIngredientsPrimary",
                `${t.ingredients} (${primaryLang === "en" ? t.english : t.spanish})`,
                submittedRecipe.ingredientPlainText[primaryLang],
                (value) =>
                    setSubmittedRecipe((prev) => ({
                    ...prev,
                    ingredientPlainText: {
                        ...prev.ingredientPlainText,
                        [primaryLang]: value,
                    },
                    })),
                true
                )}

                {renderTextField(
                "submitRecipeInstructionsPrimary",
                `${t.instructions} (${primaryLang === "en" ? t.english : t.spanish})`,
                submittedRecipe.instructions[primaryLang],
                (value) =>
                    setSubmittedRecipe((prev) => ({
                    ...prev,
                    instructions: {
                        ...prev.instructions,
                        [primaryLang]: value,
                    },
                    })),
                true
                )}
            </div>

            <button
                type="button"
                className="btn btn-outline mb-6"
                onClick={() => setShowOtherLanguage((prev) => !prev)}
            >
                {showOtherLanguage ? t.hideOtherLanguage : t.addOtherLanguage}
            </button>

            {showOtherLanguage && (
                <div className="border rounded-lg p-4 mb-6">
                <h4 className="font-bold text-lg mb-4">
                    {secondaryLang === "en" ? t.english : t.spanish}
                </h4>

                {renderTextField(
                    "submitRecipeTitleSecondary",
                    `${t.recipeTitle} (${secondaryLang === "en" ? t.english : t.spanish})`,
                    submittedRecipe.title[secondaryLang],
                    (value) =>
                    setSubmittedRecipe((prev) => ({
                        ...prev,
                        title: { ...prev.title, [secondaryLang]: value },
                    }))
                )}

                {renderTextField(
                    "submitRecipeIngredientsSecondary",
                    `${t.ingredients} (${secondaryLang === "en" ? t.english : t.spanish})`,
                    submittedRecipe.ingredientPlainText[secondaryLang],
                    (value) =>
                    setSubmittedRecipe((prev) => ({
                        ...prev,
                        ingredientPlainText: {
                        ...prev.ingredientPlainText,
                        [secondaryLang]: value,
                        },
                    })),
                    true
                )}

                {renderTextField(
                    "submitRecipeInstructionsSecondary",
                    `${t.instructions} (${secondaryLang === "en" ? t.english : t.spanish})`,
                    submittedRecipe.instructions[secondaryLang],
                    (value) =>
                    setSubmittedRecipe((prev) => ({
                        ...prev,
                        instructions: {
                        ...prev.instructions,
                        [secondaryLang]: value,
                        },
                    })),
                    true
                )}
                </div>
            )}

            <label className="font-semibold block mb-1" htmlFor="submitRecipeImage">
                {t.image}
            </label>
            <input
                id="submitRecipeImage"
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full mb-4"
                onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) await handleImageUpload(file);
                }}
            />

            {isUploadingImage && (
                <p className="mb-4 text-sm">{t.uploadingImage}</p>
            )}

            {submittedRecipe.imageURI && (
                <div className="mb-4">
                <img
                    src={submittedRecipe.imageURI}
                    alt="Recipe preview"
                    className="w-full max-h-64 object-cover rounded mb-3"
                />
                <button
                    type="button"
                    className="btn btn-sm btn-error"
                    onClick={() =>
                    setSubmittedRecipe((prev) => ({
                        ...prev,
                        imageURI: "",
                        public_id: "",
                    }))
                    }
                >
                    {t.removeImage}
                </button>
                </div>
            )}

            <h4 className="font-bold mt-6 mb-2">{t.tags}</h4>
            <div className="mb-4">
                {tagsList.map((tag) => {
                const isChecked =
                    submittedRecipe.tags.en.includes(tag.en) ||
                    submittedRecipe.tags.es.includes(tag.es);

                return (
                    <label key={tag._id} className="flex gap-2 mb-2">
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) =>
                        setSubmittedRecipe((prev) => ({
                            ...prev,
                            tags: toggleLocalizedPair(
                            prev.tags,
                            tag.en,
                            tag.es,
                            e.target.checked
                            ),
                        }))
                        }
                    />
                    <span>{tag[lang]}</span>
                    </label>
                );
                })}
            </div>

            <h4 className="font-bold mt-6 mb-2">{t.allergens}</h4>
            <div className="mb-4">
                {allergensList.map((allergen) => {
                const isChecked =
                    submittedRecipe.allergens.en.includes(allergen.en) ||
                    submittedRecipe.allergens.es.includes(allergen.es);

                return (
                    <label key={allergen._id} className="flex gap-2 mb-2">
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) =>
                        setSubmittedRecipe((prev) => ({
                            ...prev,
                            allergens: toggleLocalizedPair(
                            prev.allergens,
                            allergen.en,
                            allergen.es,
                            e.target.checked
                            ),
                        }))
                        }
                    />
                    <span>{allergen[lang]}</span>
                    </label>
                );
                })}
            </div>

            <h4 className="font-bold mt-6 mb-2">{t.appliances}</h4>
            <div className="mb-4">
                {appliancesList.map((appliance) => {
                const isChecked =
                    submittedRecipe.appliances.en.includes(appliance.en) ||
                    submittedRecipe.appliances.es.includes(appliance.es);

                return (
                    <label key={appliance._id} className="flex gap-2 mb-2">
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) =>
                        setSubmittedRecipe((prev) => ({
                            ...prev,
                            appliances: toggleLocalizedPair(
                            prev.appliances,
                            appliance.en,
                            appliance.es,
                            e.target.checked
                            ),
                        }))
                        }
                    />
                    <span>{appliance[lang]}</span>
                    </label>
                );
                })}
            </div>

            <div className="flex gap-4 mt-8">
                <button
                type="button"
                className="btn btn-secondary flex-1"
                onClick={resetAndClose}
                disabled={isSubmitting || isUploadingImage}
                >
                {t.cancel}
                </button>

                <button
                type="submit"
                className="btn flex-1 bg-gray-200 text-black hover:bg-gray-300 border-none"
                disabled={isSubmitting || isUploadingImage}
                >
                {isSubmitting ? t.submitting : t.submit}
                </button>
            </div>
            </form>
        </div>
        </dialog>
    );
}