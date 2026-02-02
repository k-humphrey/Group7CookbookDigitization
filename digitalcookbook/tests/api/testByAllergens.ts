// Test: api/recipes/byAllergens/route

export async function testByAllergens() {
    try {
        // allergen tags to search by
        const searchTerm = "dairy";
        // get searched for recipes and display them if able
        const recipes = await (await fetch(`http://localhost:3000/api/recipes/byAllergens?allergenTags=${searchTerm}`)).json();
        console.log(`Recipe by allergens ${searchTerm}:\n`, recipes);
    } catch (err) {
        console.error("Error testing api/recipes/byAllergens/route: ", err);
    }
}

testByAllergens();