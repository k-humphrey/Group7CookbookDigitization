// Test: api/ingredients/route

export async function testIngredients() {
    try {
        //get ingredients and display them if able
        const ingredients = await (await fetch("http://localhost:3000/api/ingredients")).json();
        console.log("All ingredients: ", ingredients);
    } catch (err) {
        console.error("Error testing api/ingredients/route: ", err);
    }
}

testIngredients();