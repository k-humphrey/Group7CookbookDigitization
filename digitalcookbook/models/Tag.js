import mongoose from "mongoose";

const TagSchema = new mongoose.Schema(
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
    collection: "tags",
  }
);

export default mongoose.models.Tag || mongoose.model("Tag", TagSchema);