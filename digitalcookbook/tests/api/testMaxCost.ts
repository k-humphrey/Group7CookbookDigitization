// Test: api/recipes/maxCost

export async function testMaxCost() {
    try {
        //get maxCost and display if possible
        const res = await (await fetch("http://localhost:3000/api/recipes/maxCost")).json();
        console.log("MaxCost: ", res.maxCost);
    } catch (err) {
        console.error("Error testing api/recipes/route: ", err);
    }
}

testMaxCost();