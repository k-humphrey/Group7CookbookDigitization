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
    public_id: String,
    tags: {
        'Blue Ribbon': Boolean,
        'Vegan': Boolean,
        'Vegetarian': Boolean,
    },
    ingredients: [
        {
            ingredient: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient',  required: false},
            amount: Number,
            unit: String,
            en: String,
            es: String,
            costPerUnit: Number,
            baseUnit: String,
            productLink: String,
            multiplier: Number,
            price: Number,
            storeName: String,
            packageSize: Number,
            ingredientCost: Number
        },
    ],
    appliances: [
        {
            appliance: { type: mongoose.Schema.Types.ObjectId, ref: 'Appliance',  required: false},
            en: String,
            es: String
        },
    ],
    totalCost: Number,
    allergens: {
        'Tree Nuts': Boolean,
        'Peanuts': Boolean,
        'Dairy': Boolean,
        'Egg': Boolean,
        'Wheat': Boolean,
        'Soy': Boolean,
        'Fish': Boolean,
    },
    espTags: {
        'Cinta Azul': Boolean,
        'Vegano': Boolean,
        'Vegetariano': Boolean,
    },
    espAllergens: {
        'Frutos Secos': Boolean,
        'Cacahuetes': Boolean,
        'Derechos Lácteos': Boolean,
        'Huevo': Boolean,
        'Trigo': Boolean,
        'Soja': Boolean,
        'Pescado': Boolean,
    },
    category: String 
});

export default mongoose.models.Recipe || mongoose.model('Recipe', recipeSchema);