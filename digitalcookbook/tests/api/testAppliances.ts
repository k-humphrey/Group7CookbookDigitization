// Test: api/appliances/route

export async function testAppliances() {
    try {
        //get ingredients and display them if able
        const appliances = await (await fetch("http://localhost:3000/api/appliances")).json();
        console.log("All ingredients: ", appliances);
    } catch (err) {
        console.error("Error testing api/ingredients/route: ", err);
    }
}

testAppliances();