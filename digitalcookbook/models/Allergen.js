import mongoose from "mongoose";

const AllergenSchema = new mongoose.Schema(
  {
    en: {
      type: String,
      required: true,
      trim: true,
    },
    es: {
      type: String,
      required: true,
      trim: true,
    },
    recipeKey: {
      type: String,
      required: true,
      trim: true,
    },
    espRecipeKey: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "allergens",
  }
);

export default mongoose.models.Allergen || mongoose.model("Allergen", AllergenSchema);