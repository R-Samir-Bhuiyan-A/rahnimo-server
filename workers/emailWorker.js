import Campaign from "../models/Campaign.js";
import Subscriber from "../models/Subscriber.js";
import { sendEmail } from "../utils/sendEmail.js";
import Handlebars from "handlebars";
import logger from "../utils/logger.js";
import { generateUnsubscribeToken } from "../utils/tokenUtils.js";
import dotenv from "dotenv";

dotenv.config();

// The processor function for the in-memory queue
export const processEmailJob = async (data) => {
    const { campaignId, subscriberId } = data;

    try {
        const campaign = await Campaign.findById(campaignId).populate("templateId");
        const subscriber = await Subscriber.findById(subscriberId);

        if (!campaign || !subscriber) {
            logger.warn(`Job skipped: Campaign ${campaignId} or Subscriber ${subscriberId} not found`);
            return;
        }

        if (subscriber.status !== "active") {
            return; // Skip
        }

        const template = campaign.templateId;

        // Compile templates
        const subjectCompiled = Handlebars.compile(campaign.subject);
        const htmlCompiled = Handlebars.compile(template.html);
        const textCompiled = Handlebars.compile(template.text);

        const token = generateUnsubscribeToken(subscriber._id, subscriber.email);
        const unsubscribeUrl = `${process.env.BACKEND_URL}/api/unsubscribe?token=${token}`;

        // Physical address placeholder
        const address = process.env.PHYSICAL_ADDRESS || "Rahnimo HQ";

        const variables = {
            email: subscriber.email,
            unsubscribeUrl,
            address,
            companyName: process.env.COMPANY_NAME || "Rahnimo",
            websiteUrl: process.env.USER_URL || "https://rahnimo.com",
            currentYear: new Date().getFullYear(),
            today: new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }),
            ...subscriber.toObject() // allow accessing other props
        };

        const subject = subjectCompiled(variables);
        const html = htmlCompiled(variables);
        const text = textCompiled(variables);

        try {
            await sendEmail({
                to: subscriber.email,
                subject,
                html,
                text
            });

            // Update stats
            await Campaign.findByIdAndUpdate(campaignId, { $inc: { "stats.sent": 1 } });

        } catch (sendError) {
            logger.error(`Failed to send email to ${subscriber.email}: ${sendError.message}`);
            await Campaign.findByIdAndUpdate(campaignId, { $inc: { "stats.failed": 1 } });
            // In memory queue: we might want to throw to let async know it failed, 
            // but for now we just log and count it as failed to avoid infinite retries loops in simple implementation
        }

    } catch (error) {
        logger.error(`Worker execution error: ${error.message}`);
    }
};
