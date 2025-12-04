// Test: api/recipes/byTitle/route

export async function testByTitle() {
    try {
        // title to search by
        const searchTerm = "Hawaiian Chicken with Steamed Broccoli";
        // get searched for recipes and display them if able
        const recipes = await (await fetch(`http://localhost:3000/api/recipes/byTitle?search=${searchTerm}`)).json();
        console.log(`Recipe by title ${searchTerm}:\n`, recipes);
    } catch (err) {
        console.error("Error testing api/recipes/byTitle/route: ", err);
    }
}

testByTitle();