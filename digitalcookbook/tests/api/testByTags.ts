// Test: api/recipes/byTags/route

export async function testByTags() {
    try {
        // tags to search by
        const searchTerm = "blueRibbon"
        // get searched for recipes and display them if able
        const recipes = await (await fetch(`http://localhost:3000/api/recipes/byTags?tags=${searchTerm}`)).json();
        console.log(`Recipe by tags ${searchTerm}:\n`, recipes);
    } catch (err) {
        console.error("Error testing api/recipes/byTags/route: ", err);
    }
}

testByTags();