import Campaign from "../models/Campaign.js";
import { enqueueCampaign } from "../controller/adminNewsletterController.js";
import logger from "../utils/logger.js";

const CHECK_INTERVAL = 60 * 1000; // Check every 60 seconds

export const initScheduler = () => {
    logger.info("⏰ Campaign Scheduler Initialized");

    setInterval(async () => {
        try {
            const now = new Date();

            // Find campaigns that are scheduled AND their time has passed
            const campaigns = await Campaign.find({
                status: "scheduled",
                sendAt: { $lte: now }
            });

            if (campaigns.length > 0) {
                logger.info(`⏰ Found ${campaigns.length} campaigns to process.`);

                for (const campaign of campaigns) {
                    logger.info(`Processing scheduled campaign: ${campaign.name}`);

                    // Mark as processing first to avoid double-process race conditions
                    campaign.status = "processing";
                    await campaign.save();

                    // Enqueue
                    enqueueCampaign(campaign._id);
                }
            }

        } catch (error) {
            logger.error(`Scheduler Error: ${error.message}`);
        }
    }, CHECK_INTERVAL);
};
