// Test: api/recipes/bySearch/route

export async function testBySearch() {
    try {
        //get recipes and display them if able
        const recipes = await (await fetch("http://localhost:3000/api/recipes/bySearch?title=chicken&ingredients=chicken&tags=blueRibbon&appliance=oven")).json();
        console.log("All Searched for Recipes: ", recipes);
    } catch (err) {
        console.error("Error testing api/recipes/bySearch/route: ", err);
    }
}

testBySearch();