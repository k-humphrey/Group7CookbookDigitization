import mongoose, { Schema, model, models } from "mongoose";

// 1. Define the missing sub-schemas first
const localizedTextSchema = new Schema({
    en: { type: String, default: "" },
    es: { type: String, default: "" },
}, { _id: false });

const ingredientSchema = new Schema({
    _id: String,
    en: String,
    es: String,
    amount: String,
    unit: String,
    multiplier: Number,
    ingredientCost: Number,
    packageSize: Number,
    packageSizeUnit: String,
}, { _id: false });

// 2. Define the main Submitted Recipe Schema
const submittedRecipeSchema = new Schema({
    title: localizedTextSchema,
    ingredientPlainText: localizedTextSchema,
    ingredients: [ingredientSchema], // Structured ingredients array
    instructions: localizedTextSchema,
    imageURI: { type: String, default: "" },
    public_id: { type: String, default: "" },
    tags: { type: Map, of: Boolean, default: {} },
    espTags: { type: Map, of: Boolean, default: {} },
    allergens: { type: Map, of: Boolean, default: {} },
    espAllergens: { type: Map, of: Boolean, default: {} },
    appliances: [String],
    category: { type: String, default: "lunchDinner" },
    submittedFromLang: { type: String, enum: ["en", "es"], default: "en" },
    status: { 
        type: String, 
        enum: ["pending", "approved", "rejected"], 
        default: "pending" 
    },
}, { timestamps: true });

// 3. Export the model (checking if it exists already to prevent re-compilation errors)
const SubmittedRecipe = models.SubmittedRecipe || model("SubmittedRecipe", submittedRecipeSchema);

export default SubmittedRecipe;