import async from "async";
import logger from "../utils/logger.js";
import { processEmailJob } from "../workers/emailWorker.js";

logger.info("📧 Email Queue (In-Memory) Ready");

// Create a queue object with concurrency of 5
export const emailQueue = async.queue(async (task, callback) => {
    try {
        await processEmailJob(task);
    } catch (err) {
        logger.error(`Queue processing error: ${err.message}`);
    }
}, 5);

// Error handler
emailQueue.error((err, task) => {
    logger.error(`Task ${task} experienced an error: ${err}`);
});

emailQueue.drain(() => {
    logger.info('All email items have been processed');
});
