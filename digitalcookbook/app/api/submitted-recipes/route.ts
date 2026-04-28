// app/api/submitted-recipes/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/connectToDB";
import SubmittedRecipe from "@/models/SubmittedRecipe";

type LocalizedText = {
  en?: string;
  es?: string;
};

type LocalizedArray = {
  en?: string[];
  es?: string[];
};

// Structured ingredient type matching your Admin Panel
type IngredientEntry = {
  _id: string;
  en: string;
  es: string;
  amount: string | number;
  unit: string;
  multiplier: number;
  price?: number;
  packageSize?: number;
  packageSizeUnit?: string;
  ingredientCost?: number;
};

type SubmittedRecipePayload = {
  _id?: string;
  title?: LocalizedText;
  ingredientPlainText?: LocalizedText;
  ingredients?: IngredientEntry[]; // Added structured ingredients
  instructions?: LocalizedText;
  imageURI?: string;
  public_id?: string;
  tags?: any; // Changed to any to handle both array and object formats from Admin Panel
  espTags?: any;
  allergens?: any;
  espAllergens?: any;
  appliances?: string[];
  category?: string;
  submittedFromLang?: "en" | "es";
  status?: "pending" | "approved" | "rejected";
};

function normalizeText(value?: string) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeLocalizedText(field?: LocalizedText) {
  return {
    en: normalizeText(field?.en),
    es: normalizeText(field?.es),
  };
}

// Helper to ensure ingredients are properly formatted
function normalizeIngredients(ingredients?: any[]) {
  if (!Array.isArray(ingredients)) return [];
  return ingredients.map(ing => ({
    ...ing,
    amount: String(ing.amount || ""),
    unit: normalizeText(ing.unit),
    multiplier: Number(ing.multiplier) || 1
  }));
}

// GET: Fetch all submissions
export async function GET() {
  try {
    await connectToDB();
    const submittedRecipes = await SubmittedRecipe.find()
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(submittedRecipes, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Failed to fetch." }, { status: 500 });
  }
}

// POST: Create a submission from the Modal
export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const body = (await req.json()) as SubmittedRecipePayload;

    const submittedRecipe = await SubmittedRecipe.create({
      title: normalizeLocalizedText(body.title),
      ingredientPlainText: normalizeLocalizedText(body.ingredientPlainText),
      ingredients: normalizeIngredients(body.ingredients), // Support for structured data
      instructions: normalizeLocalizedText(body.instructions),
      imageURI: normalizeText(body.imageURI),
      public_id: normalizeText(body.public_id),
      tags: body.tags || {},
      espTags: body.espTags || {},
      allergens: body.allergens || {},
      espAllergens: body.espAllergens || {},
      appliances: body.appliances || [],
      category: body.category || "lunchDinner",
      submittedFromLang: body.submittedFromLang || "en",
      status: "pending",
    });

    return NextResponse.json(submittedRecipe, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Failed to create." }, { status: 500 });
  }
}

// PUT: Update a submission from the Selector (Admin View)
export async function PUT(req: NextRequest) {
  try {
    await connectToDB();
    const body = (await req.json()) as SubmittedRecipePayload;

    if (!body._id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const updatedRecipe = await SubmittedRecipe.findByIdAndUpdate(
      body._id,
      {
        title: normalizeLocalizedText(body.title),
        ingredientPlainText: normalizeLocalizedText(body.ingredientPlainText),
        ingredients: normalizeIngredients(body.ingredients),
        instructions: normalizeLocalizedText(body.instructions),
        imageURI: normalizeText(body.imageURI),
        public_id: normalizeText(body.public_id),
        tags: body.tags,
        espTags: body.espTags,
        allergens: body.allergens,
        espAllergens: body.espAllergens,
        appliances: body.appliances,
        category: body.category,
        status: body.status || "pending",
      },
      { new: true }
    );

    return NextResponse.json(updatedRecipe, { status: 200 });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: "Failed to update." }, { status: 500 });
  }
}

// DELETE: Remove a submission
export async function DELETE(req: NextRequest) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("_id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await SubmittedRecipe.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete." }, { status: 500 });
  }
}