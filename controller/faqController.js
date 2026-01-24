import Faq from "../models/Faq.js";

// Public: Get all active FAQs
export const getPublicFaqs = async (req, res) => {
    try {
        const faqs = await Faq.find({ isActive: true }).sort({ createdAt: -1 });
        res.json({ success: true, data: faqs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin: Get all FAQs (with pagination and filtering)
export const getAllFaqs = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, category } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { question: { $regex: search, $options: "i" } },
                { answer: { $regex: search, $options: "i" } }
            ];
        }

        if (category) {
            query.category = category;
        }

        const faqs = await Faq.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Faq.countDocuments(query);

        res.json({
            success: true,
            data: faqs,
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

// Admin: Create FAQ
export const createFaq = async (req, res) => {
    try {
        const { question, answer, category, isActive } = req.body;

        if (!question || !answer) {
            return res.status(400).json({ success: false, message: "Question and answer are required" });
        }

        const faq = await Faq.create({
            question,
            answer,
            category,
            isActive: isActive !== undefined ? isActive : true
        });

        res.status(201).json({ success: true, data: faq });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin: Update FAQ
export const updateFaq = async (req, res) => {
    try {
        const { id } = req.params;
        const faq = await Faq.findByIdAndUpdate(id, req.body, { new: true });

        if (!faq) {
            return res.status(404).json({ success: false, message: "FAQ not found" });
        }

        res.json({ success: true, data: faq });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin: Delete FAQ
export const deleteFaq = async (req, res) => {
    try {
        const { id } = req.params;
        const faq = await Faq.findByIdAndDelete(id);

        if (!faq) {
            return res.status(404).json({ success: false, message: "FAQ not found" });
        }

        res.json({ success: true, message: "FAQ deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
