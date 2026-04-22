// app/api/submitted-recipes/approve/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/connectToDB";
import SubmittedRecipe from "@/models/SubmittedRecipe";
import Recipe from "@/models/Recipe";
import Appliance from "@/models/Appliance";

type LocalizedText = {
    en?: string;
    es?: string;
};

type LocalizedArray = {
    en?: string[];
    es?: string[];
};

type SubmittedRecipeDoc = {
    _id: string;
    title?: LocalizedText;
    ingredientPlainText?: LocalizedText;
    instructions?: LocalizedText;
    imageURI?: string;
    public_id?: string;
    tags?: LocalizedArray;
    allergens?: LocalizedArray;
    appliances?: LocalizedArray;
    status?: "pending" | "approved" | "rejected";
};

const EN_TAG_KEYS = ["Blue Ribbon", "Vegan", "Vegetarian"] as const;
const ES_TAG_KEYS = ["Cinta Azul", "Vegano", "Vegetariano"] as const;

const EN_ALLERGEN_KEYS = [
    "Tree Nuts",
    "Peanuts",
    "Dairy",
    "Egg",
    "Wheat",
    "Soy",
    "Fish",
] as const;

const ES_ALLERGEN_KEYS = [
    "Frutos Secos",
    "Cacahuetes",
    "Derechos Lácteos",
    "Huevo",
    "Trigo",
    "Soja",
    "Pescado",
] as const;

function normalizeText(value?: string) {
    return typeof value === "string" ? value.trim() : "";
}

function normalizeArray(value?: string[]) {
    if (!Array.isArray(value)) return [];
    return value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean);
}

function buildBooleanMap(allowedKeys: readonly string[], selectedValues: string[]) {
    const selectedSet = new Set(selectedValues);
    return allowedKeys.reduce<Record<string, boolean>>((acc, key) => {
        acc[key] = selectedSet.has(key);
        return acc;
    }, {});
}

export async function POST(req: NextRequest) {
    try {
        await connectToDB();

        const { _id } = await req.json();

        if (!_id) {
        return NextResponse.json(
            { success: false, error: "Submitted recipe id is required." },
            { status: 400 }
        );
        }

        const submitted = (await SubmittedRecipe.findById(_id).lean()) as SubmittedRecipeDoc | null;

        if (!submitted) {
        return NextResponse.json(
            { success: false, error: "Submitted recipe not found." },
            { status: 404 }
        );
        }

        const title = {
        en: normalizeText(submitted.title?.en),
        es: normalizeText(submitted.title?.es),
        };

        const ingredientPlainText = {
        en: normalizeText(submitted.ingredientPlainText?.en),
        es: normalizeText(submitted.ingredientPlainText?.es),
        };

        const instructions = {
        en: normalizeText(submitted.instructions?.en),
        es: normalizeText(submitted.instructions?.es),
        };

        if (
        !title.en &&
        !title.es
        ) {
        return NextResponse.json(
            { success: false, error: "Submitted recipe must include at least one title." },
            { status: 400 }
        );
        }

        if (
        !ingredientPlainText.en &&
        !ingredientPlainText.es
        ) {
        return NextResponse.json(
            { success: false, error: "Submitted recipe must include ingredients in at least one language." },
            { status: 400 }
        );
        }

        if (
        !instructions.en &&
        !instructions.es
        ) {
        return NextResponse.json(
            { success: false, error: "Submitted recipe must include instructions in at least one language." },
            { status: 400 }
        );
        }

        const submittedEnglishTags = normalizeArray(submitted.tags?.en);
        const submittedSpanishTags = normalizeArray(submitted.tags?.es);

        const submittedEnglishAllergens = normalizeArray(submitted.allergens?.en);
        const submittedSpanishAllergens = normalizeArray(submitted.allergens?.es);

        const submittedEnglishAppliances = normalizeArray(submitted.appliances?.en);
        const submittedSpanishAppliances = normalizeArray(submitted.appliances?.es);

        const tags = buildBooleanMap(EN_TAG_KEYS, submittedEnglishTags);
        const espTags = buildBooleanMap(ES_TAG_KEYS, submittedSpanishTags);

        const allergens = buildBooleanMap(EN_ALLERGEN_KEYS, submittedEnglishAllergens);
        const espAllergens = buildBooleanMap(ES_ALLERGEN_KEYS, submittedSpanishAllergens);

        const matchedAppliances = await Appliance.find({
        $or: [
            { en: { $in: submittedEnglishAppliances } },
            { es: { $in: submittedSpanishAppliances } },
        ],
        }).lean();

        const recipeAppliances = matchedAppliances.map((appliance: any) => ({
            appliance: appliance._id,
            en: appliance.en || "",
            es: appliance.es || "",
        }));

        const newRecipe = {
            title,
            ingredientPlainText,
            instructions,
            imageURI: normalizeText(submitted.imageURI),
            public_id: normalizeText(submitted.public_id),
            tags,
            espTags,
            ingredients: [],
            appliances: recipeAppliances,
            totalCost: 0,
            allergens,
            espAllergens,
        };

        await Recipe.create(newRecipe);
        await SubmittedRecipe.findByIdAndDelete(_id);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Submitted recipe approve API error:", error);
        return NextResponse.json(
        { success: false, error: "Failed to approve submitted recipe." },
        { status: 500 }
        );
    }
}