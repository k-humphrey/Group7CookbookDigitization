// Test: api/tags/route

export async function testTags() {
    try {
        //get tags and display them if able
        const tags = await (await fetch("http://localhost:3000/api/tags")).json();
        console.log("All Tags: ", tags);
    } catch (err) {
        console.error("Error testing api/tags/route: ", err);
    }
}

testTags();