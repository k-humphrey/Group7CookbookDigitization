import mongoose from 'mongoose';

const IngredientSchema = new mongoose.Schema({
    en: String,
    es: String,
    costPerUnit: Number,
});
    
export default mongoose.models.Ingredient || mongoose.model('Ingredient', IngredientSchema);