import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    source: {
        type: String,
        default: "website",
    },
    tags: [{
        type: String,
    }],
    status: {
        type: String,
        enum: ["active", "unsubscribed", "bounced"],
        default: "active",
    },
    ip: String,
    subscribedAt: {
        type: Date,
        default: Date.now,
    },
    unsubscribedAt: Date,
}, { timestamps: true });

export default mongoose.model("Subscriber", subscriberSchema);
