// digitalcookbook/models/SubmittedRecipe.js

import mongoose from "mongoose";

const localizedTextSchema = new mongoose.Schema(
    {
        en: { type: String, default: "" },
        es: { type: String, default: "" },
    },
    { _id: false }
);

const localizedArraySchema = new mongoose.Schema(
    {
        en: { type: [String], default: [] },
        es: { type: [String], default: [] },
    },
    { _id: false }
);

const SubmittedRecipeSchema = new mongoose.Schema(
    {
        title: { type: localizedTextSchema, required: true },
        ingredientPlainText: { type: localizedTextSchema, required: true },
        instructions: { type: localizedTextSchema, required: true },

        imageURI: { type: String, default: "" },
        public_id: { type: String, default: "" },

        tags: {
            type: [
                {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Tag",
                },
            ],
            default: [],
        },
        allergens: {
            type: [
                {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Allergen",
                },
            ],
            default: [],
        },
        appliances: {
            type: [
                {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Appliance",
                },
            ],
            default: [],
        },

        submittedFromLang: {
            type: String,
            enum: ["en", "es"],
            default: "en",
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
    },
    {
        timestamps: true,
        collection: "submittedRecipes",
    }
);

export default mongoose.models.SubmittedRecipe || mongoose.model("SubmittedRecipe", SubmittedRecipeSchema);