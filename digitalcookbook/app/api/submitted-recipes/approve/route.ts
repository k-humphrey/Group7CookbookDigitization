// app/api/submitted-recipes/approve/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/connectToDB";
import SubmittedRecipe from "@/models/SubmittedRecipe";
import Recipe from "@/models/Recipe";
import Tag from "@/models/Tag";
import Allergen from "@/models/Allergen";
import Appliance from "@/models/Appliance";
import Ingredient from "@/models/Ingredient";

type LocalizedText = {
    en?: string;
    es?: string;
};

type SubmittedIngredient = {
  ingredient?: string;
  amount?: number;
  unit?: string;
  multiplier?: number;
};

type SubmittedRecipeDoc = {
    _id: string;
    title?: LocalizedText;
    ingredientPlainText?: LocalizedText;
    instructions?: LocalizedText;
    imageURI?: string;
    public_id?: string;
    tags?: string[];
    allergens?: string[];
    appliances?: string[];
    ingredients?: SubmittedIngredient[];
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

function normalizeId(value: any) {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (value._id) return value._id.toString();
    return value.toString();
}

function normalizeMultilineToRecipeDelimiter(value?: string) {
    return typeof value === "string"
        ? value
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean)
            .join("|||\n")
        : "";
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

        if (submitted.status === "approved") {
            return NextResponse.json(
                { success: false, error: "Submitted recipe has already been approved." },
                { status: 400 }
            );
        }

        const title = {
        en: normalizeText(submitted.title?.en),
        es: normalizeText(submitted.title?.es),
        };

        const ingredientPlainText = {
        en: normalizeMultilineToRecipeDelimiter(submitted.ingredientPlainText?.en),
        es: normalizeMultilineToRecipeDelimiter(submitted.ingredientPlainText?.es),
        };

        const instructions = {
        en: normalizeMultilineToRecipeDelimiter(submitted.instructions?.en),
        es: normalizeMultilineToRecipeDelimiter(submitted.instructions?.es),
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

        const submittedTagIds = Array.isArray(submitted.tags) ? submitted.tags : [];
        const submittedAllergenIds = Array.isArray(submitted.allergens) ? submitted.allergens : [];
        const submittedApplianceIds = Array.isArray(submitted.appliances) ? submitted.appliances : [];
        const submittedIngredients = Array.isArray(submitted.ingredients) ? submitted.ingredients : [];
        const submittedIngredientIds = submittedIngredients
            .map((item) => normalizeId(item.ingredient))
            .filter(Boolean);

        const matchedTags = await Tag.find({
            _id: { $in: submittedTagIds },
        }).lean();

        const matchedAllergens = await Allergen.find({
            _id: { $in: submittedAllergenIds },
        }).lean();

        const tags = buildBooleanMap(
            EN_TAG_KEYS,
            matchedTags.map((tag: any) => tag.recipeKey)
        );

        const espTags = buildBooleanMap(
            ES_TAG_KEYS,
            matchedTags.map((tag: any) => tag.espRecipeKey)
        );

        const allergens = buildBooleanMap(
            EN_ALLERGEN_KEYS,
            matchedAllergens.map((allergen: any) => allergen.recipeKey)
        );

        const espAllergens = buildBooleanMap(
            ES_ALLERGEN_KEYS,
            matchedAllergens.map((allergen: any) => allergen.espRecipeKey)
        );

        const matchedAppliances = await Appliance.find({
            _id: { $in: submittedApplianceIds },
        }).lean();

        const recipeAppliances = matchedAppliances.map((appliance: any) => ({
            appliance: appliance._id,
            en: appliance.en || "",
            es: appliance.es || "",
        }));

        const matchedIngredients = await Ingredient.find({
        _id: { $in: submittedIngredientIds },
        }).lean();

        const ingredientById = new Map(
        matchedIngredients.map((ingredient: any) => [
            ingredient._id.toString(),
            ingredient,
        ])
        );

        const recipeIngredients = submittedIngredients
        .map((item) => {
            const matched = ingredientById.get(normalizeId(item.ingredient));
            if (!matched) return null;

            const amount = Number(item.amount) || 0;
            const multiplier = Number(item.multiplier) || 1;
            const costPerUnit = Number(matched.costPerUnit) || 0;
            const ingredientCost = amount * multiplier * costPerUnit;

            return {
            ingredient: matched._id,
            amount,
            unit: item.unit || matched.baseUnit || "",
            en: matched.en || "",
            es: matched.es || "",
            costPerUnit,
            baseUnit: matched.baseUnit || "",
            productLink: matched.productLink || "",
            multiplier,
            price: Number(matched.price) || 0,
            storeName: matched.storeName || "",
            packageSize: Number(matched.packageSize) || 0,
            ingredientCost,
            };
        })
        .filter(Boolean);

        const totalCost = recipeIngredients.reduce(
        (sum: number, item: any) => sum + item.ingredientCost,
        0
        );

        console.log("submitted.ingredients:", submitted.ingredients);
        console.log("submittedIngredientIds:", submittedIngredientIds);
        console.log("matchedIngredients:", matchedIngredients);
        console.log("recipeIngredients:", recipeIngredients);
        const newRecipe = {
            title,
            ingredientPlainText,
            instructions,
            imageURI: normalizeText(submitted.imageURI),
            public_id: normalizeText(submitted.public_id),
            tags,
            espTags,
            ingredients: recipeIngredients,
            appliances: recipeAppliances,
            totalCost,
            allergens,
            espAllergens,
        };

        await Recipe.create(newRecipe);

        await SubmittedRecipe.findByIdAndUpdate(
            _id,
            { status: "approved" },
            { runValidators: true }
        );

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Submitted recipe approve API error:", error);
        return NextResponse.json(
        { success: false, error: "Failed to approve submitted recipe." },
        { status: 500 }
        );
    }
}