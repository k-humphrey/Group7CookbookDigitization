import mongoose from 'mongoose';

const recipeAnalyticsSchema = new mongoose.Schema({
    recipeId: {type: String, required: true, unique: true},
    monthlyViewCount: {type: Number, default: 1},
    monthCreated: {type: Date, default: () => new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1, 0, 0, 0))},
});
    
export default mongoose.models.RecipeAnalytics || mongoose.model('RecipeAnalytics', recipeAnalyticsSchema);