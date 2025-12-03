// Test: api/recipes/route

export async function testRecipes() {
    try {
        //get recipes and display them if able
        const recipes = await (await fetch("http://localhost:3000/api/recipes")).json();
        console.log("All recipes: ", recipes);
    } catch (err) {
        console.error("Error testing api/recipes/route: ", err);
    }
}

testRecipes();