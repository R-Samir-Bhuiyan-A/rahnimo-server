import mongoose from "mongoose";

const templateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    subject: {
        type: String,
        required: true,
    },
    html: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export default mongoose.model("Template", templateSchema);
