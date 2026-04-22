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

type SubmittedRecipePayload = {
  _id?: string;
  title?: LocalizedText;
  ingredientPlainText?: LocalizedText;
  instructions?: LocalizedText;
  imageURI?: string;
  public_id?: string;
  tags?: LocalizedArray;
  allergens?: LocalizedArray;
  appliances?: LocalizedArray;
  submittedFromLang?: "en" | "es";
  status?: "pending" | "approved" | "rejected";
};

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

function validateLocalizedRequired(field?: LocalizedText) {
  const en = normalizeText(field?.en);
  const es = normalizeText(field?.es);
  return Boolean(en || es);
}

function normalizeLocalizedText(field?: LocalizedText) {
  return {
    en: normalizeText(field?.en),
    es: normalizeText(field?.es),
  };
}

function normalizeLocalizedArray(field?: LocalizedArray) {
  return {
    en: normalizeArray(field?.en),
    es: normalizeArray(field?.es),
  };
}

// get all submitted recipes
export async function GET() {
  try {
    await connectToDB();

    const submittedRecipes = await SubmittedRecipe.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(submittedRecipes, { status: 200 });
  } catch (error) {
    console.error("Submitted Recipes API GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch submitted recipes." },
      { status: 500 }
    );
  }
}

// create submitted recipe
export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const body = (await req.json()) as SubmittedRecipePayload;

    if (!validateLocalizedRequired(body.title)) {
      return NextResponse.json(
        { error: "At least one title is required." },
        { status: 400 }
      );
    }

    if (!validateLocalizedRequired(body.ingredientPlainText)) {
      return NextResponse.json(
        { error: "At least one ingredients field is required." },
        { status: 400 }
      );
    }

    if (!validateLocalizedRequired(body.instructions)) {
      return NextResponse.json(
        { error: "At least one instructions field is required." },
        { status: 400 }
      );
    }

    const submittedRecipe = await SubmittedRecipe.create({
      title: normalizeLocalizedText(body.title),
      ingredientPlainText: normalizeLocalizedText(body.ingredientPlainText),
      instructions: normalizeLocalizedText(body.instructions),
      imageURI: normalizeText(body.imageURI),
      public_id: normalizeText(body.public_id),
      tags: normalizeLocalizedArray(body.tags),
      allergens: normalizeLocalizedArray(body.allergens),
      appliances: normalizeLocalizedArray(body.appliances),
      submittedFromLang: body.submittedFromLang === "es" ? "es" : "en",
      status: "pending",
    });

    return NextResponse.json(submittedRecipe, { status: 201 });
  } catch (error) {
    console.error("Submitted Recipes API POST error:", error);
    return NextResponse.json(
      { error: "Failed to create submitted recipe." },
      { status: 500 }
    );
  }
}

// update submitted recipe
export async function PUT(req: NextRequest) {
  try {
    await connectToDB();

    const body = (await req.json()) as SubmittedRecipePayload;

    if (!body._id) {
      return NextResponse.json(
        { error: "Recipe id is required." },
        { status: 400 }
      );
    }

    if (!validateLocalizedRequired(body.title)) {
      return NextResponse.json(
        { error: "At least one title is required." },
        { status: 400 }
      );
    }

    if (!validateLocalizedRequired(body.ingredientPlainText)) {
      return NextResponse.json(
        { error: "At least one ingredients field is required." },
        { status: 400 }
      );
    }

    if (!validateLocalizedRequired(body.instructions)) {
      return NextResponse.json(
        { error: "At least one instructions field is required." },
        { status: 400 }
      );
    }

    const submittedRecipe = await SubmittedRecipe.findByIdAndUpdate(
      body._id,
      {
        title: normalizeLocalizedText(body.title),
        ingredientPlainText: normalizeLocalizedText(body.ingredientPlainText),
        instructions: normalizeLocalizedText(body.instructions),
        imageURI: normalizeText(body.imageURI),
        public_id: normalizeText(body.public_id),
        tags: normalizeLocalizedArray(body.tags),
        allergens: normalizeLocalizedArray(body.allergens),
        appliances: normalizeLocalizedArray(body.appliances),
        submittedFromLang: body.submittedFromLang === "es" ? "es" : "en",
        status:
          body.status && ["pending", "approved", "rejected"].includes(body.status)
            ? body.status
            : "pending",
      },
      { new: true, runValidators: true }
    );

    if (!submittedRecipe) {
      return NextResponse.json(
        { error: "Submitted recipe not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(submittedRecipe, { status: 200 });
  } catch (error) {
    console.error("Submitted Recipes API PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update submitted recipe." },
      { status: 500 }
    );
  }
}

// delete submitted recipe
export async function DELETE(req: NextRequest) {
  try {
    await connectToDB();

    const url = new URL(req.url);
    const id = url.searchParams.get("_id");

    if (!id) {
      return NextResponse.json(
        { error: "Recipe id is required." },
        { status: 400 }
      );
    }

    const deleted = await SubmittedRecipe.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Submitted recipe not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Submitted Recipes API DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete submitted recipe." },
      { status: 500 }
    );
  }
}