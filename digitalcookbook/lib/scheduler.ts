import cron from 'node-cron';
import { runPricePuller } from './pricePuller';

cron.schedule('0 3 1 * *', async () => {
    console.log("Running monthly price puller...");
    await runPricePuller();
});