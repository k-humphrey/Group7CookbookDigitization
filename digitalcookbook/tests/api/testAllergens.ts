// Test: api/allergens/route

export async function testAllergens() {
    try {
        //get allergens and display them if able
        const allergens = await (await fetch("http://localhost:3000/api/allergens")).json();
        console.log("All Allergens: ", allergens);
    } catch (err) {
        console.error("Error testing api/allergens/route: ", err);
    }
}

testAllergens();