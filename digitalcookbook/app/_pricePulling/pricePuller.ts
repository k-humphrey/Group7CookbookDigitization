//we want this to only run server side
'use server';
import { ApifyClient } from 'apify-client';
import Ingredient from "@/models/Ingredient";
import { connectToDB } from "@/lib/connectToDB";
import mongoose from "mongoose";
//create that apify client
const client = new ApifyClient({
    token: process.env.APIFY_TOKEN
});

//EVENTUALLY REPLACE WITH THE CRON JOB WRAPPING AROUND THIS.
//TO TEST ROUTE, GO TO OUR /API/RUN-PRICE-PULLER AT YOUR OWN RISK
export async function runOnce() {
    try {
        //db connection
        await connectToDB();

        //getting links
        const productLinks = await Ingredient.distinct("productLink", {
            productLink: { $exists: true }
        });

        // Remove "unknown" and anything else that isn't a real URL
        const validLinks = productLinks.filter(url =>
            typeof url === "string" &&
            url !== "unknown" &&
            url.startsWith("http")
        );
        const startUrls = validLinks.map(url => ({ url }));

        //run apify actor (walmart price scraper)
        //max crawl is 1, we know the link already.
        const run = await client.actor("t4Juw9jWflJjgpynE").call({
            startUrls,
            maxCrawlPages: 1,
        });

        //get the response dataset from apify
        const { items } = await client.dataset(run.defaultDatasetId).listItems();

        //need to put these new prices into the db now
        const tempPrices = mongoose.connection.collection("tempPrices");
        //insert
        await tempPrices.insertMany(items);

    } catch (err) {
        console.error("Error during test run:", err);
        throw err;
    }
}