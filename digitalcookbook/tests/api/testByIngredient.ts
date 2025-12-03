// Test: api/recipes/byIngredient/route

export async function testByIngredient() {
    try {
        // ingredients to search by
        const searchTerm = "Pineapple, Teriyaki";
        // get searched for recipes and display them if able
        const recipes = await (await fetch(`http://localhost:3000/api/recipes/byIngredient?ingredients=${searchTerm}`)).json();
        console.log(`Recipe by ingredients ${searchTerm}:\n`, recipes);
    } catch (err) {
        console.error("Error testing api/recipes/byIngredient/route: ", err);
    }
}

testByIngredient();