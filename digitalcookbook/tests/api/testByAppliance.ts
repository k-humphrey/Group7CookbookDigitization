// Test: api/recipes/byAppliance/route

export async function testByAppliance() {
    try {
        // ingredients to search by
        const searchTerm = "Pot";
        // get searched for recipes and display them if able
        const recipes = await (await fetch(`http://localhost:3000/api/recipes/byAppliance?appliances=${searchTerm}`)).json();
        console.log(`Recipe by Appliances ${searchTerm}:\n`, recipes);
    } catch (err) {
        console.error("Error testing api/recipes/byAppliance/route: ", err);
    }
}

testByAppliance();