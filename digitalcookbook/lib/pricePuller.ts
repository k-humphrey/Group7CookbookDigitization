'use server';

import { ApifyClient } from 'apify-client';
import Ingredient from "@/models/Ingredient";
import { connectToDB } from "@/lib/connectToDB";
import mongoose from "mongoose";
import { cookies } from "next/headers";

function extractNumber(value: string | undefined | null): number | null {
    if (!value || typeof value !== "string") return null;

    const match = value.replace(",", ".").match(/[\d.]+/);
    return match ? parseFloat(match[0]) : null;
}

function extractUnit(value: string | undefined | null): string | null {
    if (!value || typeof value !== "string") return null;

    const match = value.match(/\/\s*([a-zA-Z]+)/);
    return match ? match[1].toLowerCase() : null;
}

export async function runPricePuller() {
    try {
        const cookieStore = await cookies();
        await connectToDB(cookieStore);

        const productLinks = await Ingredient.distinct("productLink", {
            productLink: { $exists: true }
        });

        const validLinks = productLinks.filter(url =>
            typeof url === "string" &&
            url !== "unknown" &&
            url.startsWith("http")
        );

        const startUrls = validLinks.map(url => ({ url }));

        const client = new ApifyClient({
            token: process.env.APIFY_TOKEN
        });

        const run = await client.actor("t4Juw9jWflJjgpynE").call({
            startUrls,
            maxCrawlPages: 1,
        });

        const { items } = await client
            .dataset(run.defaultDatasetId)
            .listItems();

        const cleanedItems = items.map(item => {
            const rawPrice = item.priceInfo?.price ?? null;
            const rawUnitPrice = item.priceInfo?.unitPrice ?? null;

            return {
                name: item.name ?? null,
                url: item.url ?? null,
                price: extractNumber(rawPrice),
                unitPrice: extractNumber(rawUnitPrice),
                baseUnit: extractUnit(rawUnitPrice),
                pulledAt: new Date()
            };
        });

        const tempPrices = mongoose.connection.collection("tempPrices");
        await tempPrices.deleteMany({});
        
        if (cleanedItems.length > 0) {
            await tempPrices.insertMany(cleanedItems);
        }

        return { success: true, count: cleanedItems.length };

    } catch (err) {
        console.error("Price puller error:", err);
        throw err;
    }
}
