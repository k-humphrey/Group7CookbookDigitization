import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
    title: {
        en: String,
        es: String,
    },
    ingredientPlainText: {
        en: String,
        es: String,
    },
    instructions: {
        en: String,
        es: String,
    },
    imageURI: String,
    tags: {
        blueRibbon: Boolean,
        vegan: Boolean,
        vegetarian: Boolean,
    },
    ingredients: [
        {
            ingredient: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient', required: true },
            amount: Number,
            unit: String
        },
    ],
    appliances: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Appliance'
        },
    ],
    totalCost: Number,
});

export default mongoose.models.Recipe || mongoose.model('Recipe', recipeSchema);