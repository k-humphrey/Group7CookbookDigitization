// Test: api/recipes/byCost/route

export async function testByCost() {
    try {
        // costs and order to search by
        const maxCost = 10;
        const minCost = 5;
        const order = "ascend";

        // get searched for recipes and display them if able
        const recipes = await (await fetch(`http://localhost:3000/api/recipes/byCost?maxCost=${maxCost}&minCost=${minCost}&order=${order}`)).json();
        console.log(`All Recipes $${minCost}-${maxCost} in order: ${order} ${recipes}:\n`);
    } catch (err) {
        console.error("Error testing api/recipes/byCost/route: ", err);
    }
}

testByCost();