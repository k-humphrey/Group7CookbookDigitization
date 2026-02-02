// Test: api/appliances/route

export async function testAppliances() {
    try {
        //get appliances and display them if able
        const appliances = await (await fetch("http://localhost:3000/api/appliances")).json();
        console.log("All appliances: ", appliances);
    } catch (err) {
        console.error("Error testing api/appliances/route: ", err);
    }
}

testAppliances();