import mongoose from 'mongoose';

const IngredientSchema = new mongoose.Schema({
    en: String,
    es: String,
    costPerUnit: Number,
    baseUnit: String,
    productLink: String,
    price: Number,
    storeName: String,
    packageSize: Number
});
    
export default mongoose.models.Ingredient || mongoose.model('Ingredient', IngredientSchema);