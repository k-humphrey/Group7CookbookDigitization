import mongoose from 'mongoose';

const FeaturedRecipesSchema = new mongoose.Schema({
    recipeIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
    }]
});
    
export default mongoose.models.FeaturedRecipes || mongoose.model('FeaturedRecipes', FeaturedRecipesSchema);