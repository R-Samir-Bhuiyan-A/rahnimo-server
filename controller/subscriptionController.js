import Subscriber from "../models/Subscriber.js";
import validator from "validator";
import { verifyUnsubscribeToken } from "../utils/tokenUtils.js";

export const subscribe = async (req, res) => {
    try {
        let { email, source, tags } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        email = email.trim().toLowerCase();

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        const ip = req.ip;
        const existing = await Subscriber.findOne({ email });

        if (existing) {
            if (existing.status === "unsubscribed") {
                if (req.body.resubscribe === true) {
                    existing.status = "active";
                    existing.unsubscribedAt = null;
                    existing.subscribedAt = new Date();
                    if (tags) existing.tags = [...new Set([...existing.tags, ...tags])];
                    await existing.save();
                }
                // Else keep unsubscribed
            } else {
                // Already active or bounced, update details
                if (tags) existing.tags = [...new Set([...existing.tags, ...tags])];
                existing.ip = ip;
                if (existing.status === "bounced") existing.status = "active"; // Optional: reactivate bounced if they signup again?
                await existing.save();
            }
        } else {
            await Subscriber.create({
                email,
                source,
                tags,
                ip,
                status: "active"
            });
        }

        // Always 200 OK
        res.status(200).json({ ok: true });

    } catch (error) {
        console.error("Subscribe Error:", error);
        res.status(500).json({ ok: false });
    }
};

export const unsubscribe = async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) {
            return res.status(400).send("Invalid request");
        }

        const decoded = verifyUnsubscribeToken(token);
        if (!decoded) {
            return res.status(400).send("Invalid or expired unsubscribe link");
        }

        await Subscriber.findByIdAndUpdate(decoded.id, {
            status: "unsubscribed",
            unsubscribedAt: new Date(),
        });

        res.send(`
            <html>
            <head><title>Unsubscribed</title></head>
            <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                <h1>Unsubscribed successfully</h1>
                <p>You have been removed from our mailing list.</p>
            </body>
            </html>
        `);

    } catch (error) {
        console.error("Unsubscribe Error:", error);
        res.status(500).send("Server error");
    }
}
