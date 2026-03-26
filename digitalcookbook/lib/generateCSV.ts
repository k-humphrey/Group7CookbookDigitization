import { CombinedIngredient, SelectedRecipe } from "./combineIngredients";

// Function to generate and download CSV
export function generateCSV(combinedIngredients: CombinedIngredient[], selectedRecipes: SelectedRecipe[], lang: "en" | "es", fileName: string) {
    let csv = "Ingredient,Amount,Unit,Cost,Recipes\n";

    // Loop through ingredients and add to csv
    for(const ingredient of combinedIngredients) {
        // ingredient values
        const name = ingredient.ingredient?.[lang];
        const amount = ingredient.totalAmount;
        const unit = ingredient.ingredient.unit;
        const cost = ingredient.totalCost.toFixed(2);

        // get recipes using ingredient
        const recipesUsingIngredient = selectedRecipes.filter(recipe => recipe.recipe.ingredients.some(ing => ing.ingredient === ingredient.ingredient.ingredient))
        .map(recipe => recipe.recipe.title?.[lang]).join("|");

        // append to csv
        csv += `"${name}",${amount},${unit},${cost},"${recipesUsingIngredient}"\n`;
    }

    // url of file
    const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv; charset=utf-8;" }));

    // create link for download
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;

    // download csv
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}