import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    templateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Template",
        required: true,
    },
    audience: {
        status: [String],
        tags: [String],
    },
    sendAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["draft", "scheduled", "processing", "completed", "failed"],
        default: "draft",
    },
    stats: {
        sent: { type: Number, default: 0 },
        failed: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
    },
}, { timestamps: true });

export default mongoose.model("Campaign", campaignSchema);
