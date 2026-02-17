import { runPricePuller } from "@/lib/pricePuller";

export async function GET() {
    const result = await runPricePuller();
    return Response.json(result);
}
