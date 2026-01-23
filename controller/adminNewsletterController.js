import Subscriber from "../models/Subscriber.js";
import Template from "../models/Template.js";
import Campaign from "../models/Campaign.js";
import { emailQueue } from "../config/queue.js";

// Subscribers
export const getSubscribers = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search } = req.query;
        const query = {};
        if (status) query.status = status;
        if (search) query.email = { $regex: search, $options: "i" };

        const subscribers = await Subscriber.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Subscriber.countDocuments(query);

        res.json({
            success: true,
            data: subscribers,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Templates
export const createTemplate = async (req, res) => {
    try {
        const template = await Template.create(req.body);
        res.json({ success: true, data: template });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getTemplates = async (req, res) => {
    try {
        const templates = await Template.find().sort({ createdAt: -1 });
        res.json({ success: true, data: templates });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Campaigns
export const createCampaign = async (req, res) => {
    try {
        const { name, subject, templateId, audience, sendAt } = req.body;

        const campaign = await Campaign.create({
            name,
            subject,
            templateId,
            audience,
            sendAt: sendAt || new Date(),
            status: "scheduled"
        });

        // If sendAt is now (or null), queue immediately
        if (!sendAt || new Date(sendAt) <= new Date()) {
            await enqueueCampaign(campaign._id);
            campaign.status = "processing";
            await campaign.save();
        }
        // Future scheduling would need a cron or delayed job mechanism

        res.json({ success: true, data: campaign });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const enqueueCampaign = async (campaignId) => {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return;

    // Check for single user target (audience: { email: "..." })
    if (campaign.audience && campaign.audience.email) {
        const singleSubscriber = await Subscriber.findOne({ email: campaign.audience.email });
        if (singleSubscriber) {
            emailQueue.push({
                campaignId: campaign._id,
                subscriberId: singleSubscriber._id
            });
            await Campaign.findByIdAndUpdate(campaignId, { $inc: { "stats.total": 1 } });
        } else {
            // Handle case where test user isn't subscribed?
            // Since we need an ID for tokens, maybe create a temp/fake one or require they exist.
            // For now, let's assume they must exist in DB.
            console.log(`Single send skipped: ${campaign.audience.email} not found in subscribers`);
        }
        return;
    }

    let query = { status: "active" };

    // If audience is not "all", refine query
    if (campaign.audience && campaign.audience !== "all") {
        if (campaign.audience.status && campaign.audience.status.length > 0) {
            query.status = { $in: campaign.audience.status };
        }
        if (campaign.audience.tags && campaign.audience.tags.length > 0) {
            query.tags = { $in: campaign.audience.tags };
        }
    }

    const cursor = Subscriber.find(query).cursor();
    let count = 0;

    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
        emailQueue.push({
            campaignId: campaign._id,
            subscriberId: doc._id
        });
        count++;
    }

    await Campaign.findByIdAndUpdate(campaignId, {
        $inc: { "stats.total": count }
    });
};

export const updateTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const template = await Template.findByIdAndUpdate(id, req.body, { new: true });
        if (!template) {
            return res.status(404).json({ success: false, message: "Template not found" });
        }
        res.json({ success: true, data: template });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        await Template.findByIdAndDelete(id);
        res.json({ success: true, message: "Template deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
